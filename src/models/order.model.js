import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  bags: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  pricePerBag: {
    type: Number,
    required: true,
  },
  serviceFee: {
    type: Number,
    default: 2,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  dropoffDate: {
    type: Date,
    required: true,
  },
  address: {
    fullName: String,
    email: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    zip: String,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "stripe"],
    default: "cash",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  status: {
    type: String,
    enum: ["pickup", "washing", "delivery", "completed"],
    default: "pickup",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
