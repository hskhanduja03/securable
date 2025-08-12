// /app/api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/mongodb";

import { Transaction } from "@/db/models/Transaction";
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const data = await req.json();

    // Basic validation
    const {
      user,
      paymentGroup,
      paymentMethod,
      name,
      amount,
      category,
      date,
      notes,
      type,
    } = data;
    if (
      !user ||
      !paymentGroup ||
      !paymentMethod ||
      !amount ||
      !category ||
      !date ||
      !name ||
      !type
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = new Transaction({
      user,
      paymentGroup,
      paymentMethod,
      amount,
      category,
      date,
      notes,
      name,
      type,
    });

    await transaction.save();

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const transactions = await Transaction.find({ user: userId })
      .populate("paymentGroup")
      .populate("paymentMethod")
      .sort({ date: -1 });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
