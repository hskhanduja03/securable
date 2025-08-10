import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  paymentGroup: mongoose.Types.ObjectId; // ref to PaymentGroup
  paymentMethod: mongoose.Types.ObjectId; // ref to PaymentMethod
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentGroup: {
      type: Schema.Types.ObjectId,
      ref: "PaymentGroup",
      required: true,
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
