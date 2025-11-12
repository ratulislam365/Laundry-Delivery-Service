import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customer: { type: String, required: true },
  serviceType: { type: String, required: true },
  status: { type: String, enum: ["In Progress", "Completed", "Pending"], default: "In Progress" },
  platform: { type: String, enum: ["App", "Website"], required: true },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
