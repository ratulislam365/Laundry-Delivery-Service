import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Stripe", "PayPal", "Cash"], required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Completed", "Pending"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
