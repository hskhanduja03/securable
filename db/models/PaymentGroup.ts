import mongoose, { Schema, Document, Model } from "mongoose";
import { PaymentMethod } from "./PaymentMethod";

export interface IPaymentGroup extends Document {
  name: string; // e.g., "Credit Card"
  description?: string;
  user: mongoose.Types.ObjectId; // Reference to User
  methods: mongoose.Types.ObjectId[]; // Array of PaymentMethod IDs
}

const PaymentGroupSchema: Schema<IPaymentGroup> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Owner of the PaymentGroup
    methods: [{ type: Schema.Types.ObjectId, ref: "PaymentMethod" }], // Array of payment methods
  },
  { timestamps: true }
);

export const PaymentGroup: Model<IPaymentGroup> =
  mongoose.models.PaymentGroup ||
  mongoose.model<IPaymentGroup>("PaymentGroup", PaymentGroupSchema);
