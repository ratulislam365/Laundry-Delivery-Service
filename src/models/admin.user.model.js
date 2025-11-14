import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ["App", "Website", "Both"],
      default: "App",
    },
    packageStatus: {
      type: String,
      enum: ["Active", "Inactive", "None"],
      default: "None",
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
