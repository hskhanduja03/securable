import { connectDB } from "@/db/mongodb";
import { User } from "@/db/models/User";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse incoming data
    const { firstName, lastName, email, password, role, paymentMethods } =
      await req.json();

    // Ensure all required fields are present
    if (!firstName || !lastName || !email || !password) {
      return new Response(
        JSON.stringify({
          error: "First name, last name, email, and password are required",
        }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided fields
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "user", // Default role is "user"
      paymentGroups: paymentMethods || [], // Default to an empty array if no payment methods are provided
    });

    // Save the user to the database
    await newUser.save();

    // Generate access and refresh tokens
    const accessToken = generateAccessToken({ userId: newUser._id });
    const refreshToken = generateRefreshToken({ userId: newUser._id });

    // Set refresh token in cookies (httpOnly, secure for production)
    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Prepare response data
    const data = {
      accessToken,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      userId: newUser._id,
    };

    // Return the response
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
