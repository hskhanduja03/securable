import { NextResponse } from "next/server";
import { connectDB } from "@/db/mongodb";
import { PaymentGroup } from "@/db/models/PaymentGroup";
import { User } from "@/db/models/User";
import mongoose from "mongoose";

// Define the PaymentGroup and User types (if not already done)
interface IPaymentGroup {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  methods: any[];
  // Add other properties you have for PaymentGroup
}

interface IUser {
  _id: mongoose.Types.ObjectId;
  paymentGroups: mongoose.Types.ObjectId[];
  // Add other properties you have for User
}

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
    const user = await User.findById(userId).populate("paymentGroups");
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

// POST request handler
export async function POST(req: Request) {
  try {
    const { name, description, userId } = await req.json();

    // Validate userId and check if it's a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    // Validate the group name
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Ensure that userId is cast to a valid ObjectId using the `new` keyword
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new PaymentGroup and associate it with the user
    const group = new PaymentGroup({
      name,
      description,
      user: new mongoose.Types.ObjectId(userId),
      methods: [],
    });

    await group.save();

    // Add the payment group to the user's list of groups (cast group._id to ObjectId)
    if (user && group._id instanceof mongoose.Types.ObjectId) {
      user.paymentGroups.push(group._id);
      await user.save();
    }

    // Respond with the newly created group
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error("Error creating payment group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
