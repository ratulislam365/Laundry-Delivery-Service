// models/Order.js
import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{7,15}$/; // অনুমান: country code সহ 7-15 digit

const stepSubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [emailRegex, "Please provide a valid email address"],
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [phoneRegex, "Please provide a valid phone number"],
  },

  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },

  // package reference (store snapshot too for safety)
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  packageSnapshot: { // optional: store package name & price at time of order
    name: { type: String },
    weight: { type: Number },
    basePrice: { type: Number }
  },

  numberOfBags: {
    type: Number,
    required: [true, "Number of bags is required"],
    min: [1, "At least one bag required"]
  },

  pricePerBag: {
    type: Number,
    required: [true, "Price per bag is required"],
    min: [0, "Price must be positive"]
  },

  serviceFee: { type: Number, default: 0, min: [0, "Service fee can't be negative"] },

  totalPayable: {
    type: Number,
    required: true,
    min: [0, "Total payable must be non-negative"]
  },

  pickupDate: { type: Date, required: true },
  pickupTime: { type: String, required: true },
  dropoffDate: { type: Date, required: true },
  dropoffTime: { type: String, required: true },

  // steps tracking (pickup -> washing -> delivery)
  steps: {
    type: [stepSubSchema],
    default: [
      { name: "pickup", completed: false, completedAt: null },
      { name: "washing", completed: false, completedAt: null },
      { name: "delivery", completed: false, completedAt: null }
    ]
  },

  // high level status (for quick UI)
  status: {
    type: String,
    enum: ["pickup","washing","delivery","completed","cancelled"],
    default: "pickup"
  },

  // ✅ Payment Method Added
  paymentMethod: {
    type: String,
    enum: ["stripe", "cash"],
    required: true,
    default: "cash"
  },


  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null }
}, { timestamps: true });


orderSchema.pre("validate", function(next) {
  if (this.pricePerBag == null || this.numberOfBags == null) {
    return next(new Error("pricePerBag and numberOfBags are required to calculate totalPayable"));
  }

  const fee = this.serviceFee || 0;
  this.totalPayable = (this.pricePerBag * this.numberOfBags) + fee;

  // ensure steps default exists (in case someone cleared it)
  if (!Array.isArray(this.steps) || this.steps.length === 0) {
    this.steps = [
      { name: "pickup", completed: false, completedAt: null },
      { name: "washing", completed: false, completedAt: null },
      { name: "delivery", completed: false, completedAt: null }
    ];
  }

  next();
});

/**
 * Helper instance method (optional)
 * markStepComplete("washing")
 */
orderSchema.methods.markStepComplete = function(stepName) {
  const step = this.steps.find(s => s.name === stepName);
  if (step && !step.completed) {
    step.completed = true;
    step.completedAt = new Date();
    // sync high-level status if needed
    this.status = stepName === "delivery" && this.steps.every(s => s.completed) ? "completed" : stepName;
  }
  return this.save();
};

export default mongoose.model("Order", orderSchema);































// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   // 🧍 1️⃣ User Information
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   fullName: {
//     type: String,
//     required: [true, "Full name is required"],
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     lowercase: true,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     required: [true, "Phone number is required"],
//   },
//   address: {
//     houseNumber: { type: String, required: true },
//     street: { type: String },
//     city: { type: String, required: true },
//     state: { type: String },
//     country: { type: String, required: true },
//     zipCode: { type: String, required: true },
//   },

//   // 📅 2️⃣ Date & Time Info
//   pickupDate: {
//     type: Date,
//     required: [true, "Pickup date is required"],
//   },
//   pickupTime: {
//     type: String,
//     required: [true, "Pickup time is required"],
//   },
//   dropoffDate: {
//     type: Date,
//     required: [true, "Drop-off date is required"],
//   },
//   dropoffTime: {
//     type: String,
//     required: [true, "Drop-off time is required"],
//   },

//   // 📦 3️⃣ Package Information (Reference)
//   package: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Package", // 👈 প্যাকেজের সাথে সম্পর্কিত
//     required: true,
//   },
//   numberOfBags: {
//     type: Number,
//     required: true,
//     min: [1, "At least one bag required"],
//   },
//   pricePerBag: {
//     type: Number,
//     required: true,
//   },
//   serviceFee: {
//     type: Number,
//     default: 0,
//   },
//   totalPayable: {
//     type: Number,
//     required: true,
//   },
//   // 💳 শুধু রেফারেন্স রাখবে
//   paymentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Payment",
//   },
//   // // 💳 4️⃣ Payment Information
//   // paymentMethod: {
//   //   type: String,
//   //   enum: ["cash", "card"],
//   //   default: "cash",
//   // },
//   // paymentInfo: {
//   //   cardNumber: { type: String, select: false },
//   //   expirationDate: { type: String, select: false },
//   //   securityCode: { type: String, select: false },
//   // },
//   // paymentStatus: {
//   //   type: String,
//   //   enum: ["pending", "paid"],
//   //   default: "pending",
//   // },

//   // 🔄 5️⃣ Order Status Flow
//   status: {
//     type: String,
//     enum: ["pickup", "washing", "delivery", "completed"],
//     default: "pickup",
//   },
// }, { timestamps: true });

// export default mongoose.model("Order", orderSchema);
