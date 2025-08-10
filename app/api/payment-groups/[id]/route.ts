import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { PaymentGroup } from "@/db/models/PaymentGroup"; // Adjust the import as per your project structure
import { connectDB } from "@/db/mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  // Connect to DB
  await connectDB();

  try {
    // Find the payment group by its _id and populate the methods field
    const group = await PaymentGroup.findById(params.id)
      .populate({
        path: "methods", // Path to populate
        model: "PaymentMethod", // Model to populate
      })
      .lean() // Use lean() to get plain objects
      .exec();

    console.log(group); // Log to see the output and verify population

    if (!group) {
      return NextResponse.json(
        { error: "Payment group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(group); // Send the populated group back
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error fetching payment group" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Connect to DB
  await connectDB();

  try {
    const body = await req.json();

    // Find the payment group and update
    const updatedGroup = await PaymentGroup.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true } // `new: true` returns the updated document
    )
      .populate("methods")
      .exec();

    if (!updatedGroup) {
      return NextResponse.json(
        { error: "Payment group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGroup);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error updating payment group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  // Connect to DB
  await connectDB();

  try {
    const deletedGroup = await PaymentGroup.findByIdAndDelete(params.id);

    if (!deletedGroup) {
      return NextResponse.json(
        { error: "Payment group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error deleting payment group" },
      { status: 500 }
    );
  }
}
