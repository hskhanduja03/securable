import { NextResponse } from "next/server";
import { PaymentMethod } from "@/db/models/PaymentMethod";
import { PaymentGroup } from "@/db/models/PaymentGroup";
import { connectDB } from "@/db/mongodb";

// Create Payment Method and add to existing Payment Group
export async function POST(req: Request) {
  try {
    await connectDB();

    const { user, group, name, active, details, bgColor } = await req.json();

    // Required field check
    if (!user || !group || !name) {
      return NextResponse.json(
        { error: "Missing required fields: user, group, or name" },
        { status: 400 }
      );
    }

    // Validation logic
    if (name.includes("Card")) {
      if (
        !details.cardNumber ||
        !details.cardHolderName ||
        !details.expiryDate ||
        !details.cvv ||
        !details.company||
        !bgColor
      ) {
        return NextResponse.json(
          {
            error:
              "Missing card details: cardNumber, cardHolderName, expiryDate, cvv, company",
          },
          { status: 400 }
        );
      }
    } else if (name.includes("UPI")) {
      if (!details.upiId) {
        return NextResponse.json({ error: "Missing UPI ID" }, { status: 400 });
      }
    } else if (name.includes("NEFT") || name.includes("Bank")) {
      if (!details.accountNumber || !details.ifscCode) {
        return NextResponse.json(
          {
            error: "Missing bank transfer details: accountNumber, ifscCode",
          },
          { status: 400 }
        );
      }
    }

    // 1️⃣ Create and save the Payment Method
    const paymentMethod = await PaymentMethod.create({
      user,
      group,
      name,
      active,
      details,
      bgColor,
    });

    const updatedGroup = await PaymentGroup.findByIdAndUpdate(
      group,
      { $push: { methods: paymentMethod._id } },
      { new: true }
    );

    if (!updatedGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(paymentMethod, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
