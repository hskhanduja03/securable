import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/mongodb";
import { Transaction } from "@/db/models/Transaction";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { id } = params;
    const data = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID required" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Destructure fields to update (optional)
    const {
      user,
      paymentGroup,
      paymentMethod,
      amount,
      category,
      date,
      notes,
      name,
      type,
    } = data;

    // Update fields only if provided
    if (user !== undefined) transaction.user = user;
    if (paymentGroup !== undefined) transaction.paymentGroup = paymentGroup;
    if (paymentMethod !== undefined) transaction.paymentMethod = paymentMethod;
    if (amount !== undefined) transaction.amount = amount;
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;
    if (notes !== undefined) transaction.notes = notes;
    if (name !== undefined) transaction.name = name;
    if (type !== undefined) transaction.type = type;

    await transaction.save();

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
