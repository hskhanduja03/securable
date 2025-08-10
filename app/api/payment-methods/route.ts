import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { PaymentMethod } from "@/db/models/PaymentMethod"; // Import your PaymentMethod model
import { PaymentGroup } from "@/db/models/PaymentGroup";
import { connectDB } from "@/db/mongodb";



// Create Payment Method
export async function POST(req: Request) {
  try {
    await connectDB();
    const { user, group, name, active, details } = await req.json();

    // Validation for required fields based on name type
    if (!user || !group || !name) {
      return NextResponse.json(
        { error: "Missing required fields: user, group, or name" },
        { status: 400 }
      );
    }

    // Payment Method Validation Logic
    if (name.includes("Card")) {
      if (
        !details.cardNumberLast4 ||
        !details.cardHolderName ||
        !details.expiryDate ||
        !details.cvv ||
        !details.company
      ) {
        return NextResponse.json(
          {
            error:
              "Missing card details: cardNumberLast4, cardHolderName, expiryDate, cvv, company",
          },
          { status: 400 }
        );
      }
    } else if (name.includes("UPI")) {
      if (!details.upiId) {
        return NextResponse.json({ error: "Missing UPI ID" }, { status: 400 });
      }
    } else if (name.includes("NEFT") || name.includes("Bank")) {
      if (!details.accountNumberLast4 || !details.ifscCode) {
        return NextResponse.json(
          {
            error:
              "Missing bank transfer details: accountNumberLast4, ifscCode",
          },
          { status: 400 }
        );
      }
    }

    // Create the Payment Method
    const paymentMethod = new PaymentMethod({
      user,
      group,
      name,
      active,
      details,
    });

    // Save the Payment Method to the database
    await paymentMethod.save();

    // Now, let's create a new ObjectId manually
    const newObjectId = new mongoose.Types.ObjectId();

    // Find the group to update
    const groupToUpdate = await PaymentGroup.findById(group); // Find the group by ID
    if (!groupToUpdate) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Push the new ObjectId to the methods array (simulating the 'paymentMethod._id')
    groupToUpdate.methods.push(newObjectId); // Push the new manually created ObjectId
    await groupToUpdate.save(); // Save the updated Group

    // Return the newly created Payment Method
    return NextResponse.json(paymentMethod, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
