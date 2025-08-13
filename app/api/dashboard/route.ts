import { User } from "@/db/models/User";
import { connectDB } from "@/db/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract userId from query params (you could also get it from headers or cookies)
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find the user by userId
    const user = await User.findById(userId).populate({
      path: "paymentGroups",
      populate: {
        path: "methods",
        model: "PaymentMethod", // replace with your actual model name
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Populate the paymentGroups with detailed data
    const paymentGroups = user.paymentGroups;

    // Respond with the user's payment groups
    return NextResponse.json(paymentGroups, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment groups" },
      { status: 500 }
    );
  }
}