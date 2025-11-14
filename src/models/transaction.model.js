// src/models/transaction.model.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Stripe", "Cash", "PayPal"], required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Completed", "Pending"], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
