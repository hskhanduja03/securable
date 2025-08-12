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
    cardNumber?: string;
    cardHolderName?: string;
    expiryDate?: string;
    cvv?: string;
    company?: string; // e.g., Visa, Mastercard

    // Bank transfer / NEFT
    accountNumber?: string;
    ifscCode?: string;

  };
  bgColor: string;
}

const PaymentMethodSchema: Schema<IPaymentMethod> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    group: { type: Schema.Types.ObjectId, ref: "PaymentGroup", required: true }, // Reference to the PaymentGroup
    name: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    details: {
      upiId: { type: String },

      cardNumber: { type: String },
      cardHolderName: { type: String },
      expiryDate: { type: String },
      cvv: { type: String },
      company: { type: String },

      accountNumber: { type: String },
      ifscCode: { type: String },
    },
    bgColor: { type: String, required: true },
  },
  { timestamps: true }
);

export const PaymentMethod: Model<IPaymentMethod> =
  mongoose.models.PaymentMethod ||
  mongoose.model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);
