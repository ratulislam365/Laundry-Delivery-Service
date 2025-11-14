import mongoose from "mongoose";

const adminOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    serviceType: {
      type: String,
      enum: ["Wash & Fold", "Iron Only", "Wash Only", "Full Service"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    platform: {
      type: String,
      enum: ["App", "Website"],
      required: true,
    },
  },
  { timestamps: true }
);

export const AdminOrder = mongoose.model("AdminOrder", adminOrderSchema);
