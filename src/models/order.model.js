import mongoose from "mongoose";
import { nanoid } from "nanoid";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["wash & fold", "iron only", "full service"],
      default: "full service",
    },
    platform: {
      type: String,
      required: true,
      enum: ["app", "web"],
      default: "web",
      index: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: [0, "Total must be a non-negative number"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    pickupDate: { type: Date, required: true },
    dropoffDate: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["stripe", "cash"],
      required: true,
      default: "cash",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    steps: [
      {
        name: { type: String, required: true, enum: ["pickup", "washing", "delivery"] },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add compound index for frequent filtering
orderSchema.index({ createdAt: -1, status: 1, platform: 1 });

// Ensure nanoid is used for new documents
orderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderId) {
    this.orderId = nanoid(10);
  }
  next();
});

export default mongoose.model("Order", orderSchema);
