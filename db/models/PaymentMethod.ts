import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaymentMethod extends Document {
  user: mongoose.Types.ObjectId;
  group: mongoose.Types.ObjectId; // ref to PaymentGroup
  name: string; // e.g., "ICICI Credit Card", "SBI NEFT"
  active: boolean;
  details: {
    // Common optional fields
    upiId?: string;

    // Card-specific
    cardNumberLast4?: string;
    cardHolderName?: string;
    expiryDate?: string;
    cvv?: string;
    company?: string; // e.g., Visa, Mastercard

    // Bank transfer / NEFT
    accountNumberLast4?: string;
    ifscCode?: string;
  };
}

const PaymentMethodSchema: Schema<IPaymentMethod> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    group: { type: Schema.Types.ObjectId, ref: "PaymentGroup", required: true }, // Reference to the PaymentGroup
    name: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true }, // active by default
    details: {
      upiId: { type: String },

      cardNumberLast4: { type: String },
      cardHolderName: { type: String },
      expiryDate: { type: String },
      cvv: { type: String },
      company: { type: String },

      accountNumberLast4: { type: String },
      ifscCode: { type: String },
    },
  },
  { timestamps: true }
);

export const PaymentMethod: Model<IPaymentMethod> =
  mongoose.models.PaymentMethod ||
  mongoose.model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);
