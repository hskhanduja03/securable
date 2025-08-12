import mongoose from "mongoose";
import { PaymentGroup } from "@/db/models/PaymentGroup";
import { PaymentMethod } from "@/db/models/PaymentMethod";
import { Transaction } from "@/db/models/Transaction";
import { User } from "@/db/models/User";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  try {
   await import("@/db/models/User");
   await import("@/db/models/PaymentMethod");
   await import("@/db/models/PaymentGroup");
   await import("@/db/models/Transaction");
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    throw new Error("Could not connect to the database.");
  }
}
