import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";
import PackageModel from "../models/package.model.js";
import mongoose from "mongoose";
import Stripe from "stripe";

// const stripe = new Stripe("");


const calculateTotal = (pricePerBag, numberOfBags, serviceFee = 0) =>
  pricePerBag * numberOfBags + (serviceFee || 0);

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id; // auth middleware sets req.user
    const {
      packageId,
      numberOfBags,
      serviceFee = 0,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      fullName,
      email,
      phone,
      address,
      paymentMethod = "cash" // "cash" or "stripe"
    } = req.body;

    // basic validations
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ message: "Invalid packageId" });
    }

    const pkg = await PackageModel.findById(packageId);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const pricePerBag = pkg.price;
    const totalPayable = calculateTotal(pricePerBag, numberOfBags, serviceFee);

    // create order (paymentId null for now)
    const order = await Order.create({
      user: userId,
      fullName,
      email,
      phone,
      address,
      package: packageId,
      numberOfBags,
      pricePerBag,
      serviceFee,
      totalPayable,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      status: "pickup",
      paymentId: null,
    });

// --- Handle Payment ---
    if (paymentMethod === "cash") {
      const payment = await Payment.create(
        [
          {
            orderId: order._id,
            userId,
            method: "cash",
            amount: totalPayable,
            status: "pending", // Cash payment is pending until collected
          },
        ],
        { session }
      );
      
      order.paymentId = payment._id;
      await order.save({ session });
      
      await session.commitTransaction(); // Commit transaction
      session.endSession();
      return res.status(201).json({ order, payment });

    } else if (paymentMethod === "stripe") {
      // Create a Payment record in your DB *first*
      const payment = await Payment.create(
        [
          {
            orderId: order._id,
            userId,
            method: "stripe",
            amount: totalPayable,
            status: "pending", // Pending until webhook confirms success
          },
        ],
        { session }
      );

      // Now create the Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPayable * 100), // Stripe requires amount in cents
        currency: "usd", // Change as needed
        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString(),
          paymentId: payment._id.toString(), // Store our DB paymentId
        },
      });

      // Update our Payment doc with the Stripe ID
      payment.stripePaymentId = paymentIntent.id;
      await payment.save({ session });

      // Link payment to the order
      order.paymentId = payment._id;
      await order.save({ session });
      
      await session.commitTransaction(); // Commit transaction
      session.endSession();
      
      // Send the client_secret to the frontend
      return res.status(201).json({
        order,
        clientSecret: paymentIntent.client_secret,
      });

    } else {
      await session.abortTransaction(); // Abort if payment method is invalid
      session.endSession();
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (err) {
    await session.abortTransaction(); // Rollback on error
    session.endSession();
    next(err);
  }
};

// GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("package")
      .populate("paymentId")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("package")
      .populate("paymentId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // only owner or admin can view
    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("paymentId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Allow cancel only if not completed or delivered
    const forbidden = ["completed", "delivery"];
    if (forbidden.includes(order.status)) {
      return res.status(400).json({ message: "Cannot cancel order at this stage" });
    }

    // mark as cancelled (we can add canceled status)
    order.status = "cancelled";
    await order.save();

    // If payment exists and was success -> need refund logic (handle with Payment/refund flow)
    res.json({ message: "Order cancelled", order });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status (admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body; // expected pickup, washing, delivery, completed

    if (!["pickup", "washing", "delivery", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the order
    const order = await Order.findById(orderId).populate("package").populate("paymentId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update the steps based on the new status
    if (status === "pickup") {
      // Mark pickup as completed, set others as not completed
      order.steps.forEach(step => {
        if (step.name === "pickup") {
          step.completed = true;
          step.completedAt = new Date();
        } else {
          step.completed = false;
          step.completedAt = null;
        }
      });
    } else if (status === "washing") {
      // Mark pickup and washing as completed
      order.steps.forEach(step => {
        if (step.name === "pickup" || step.name === "washing") {
          step.completed = true;
          step.completedAt = new Date();
        } else {
          step.completed = false;
          step.completedAt = null;
        }
      });
    } else if (status === "delivery") {
      // Mark all steps up to delivery as completed
      order.steps.forEach(step => {
        if (step.name === "pickup" || step.name === "washing" || step.name === "delivery") {
          step.completed = true;
          step.completedAt = new Date();
        }
      });
    } else if (status === "completed") {
      // All steps are completed when status is "completed"
      order.steps.forEach(step => {
        step.completed = true;
        step.completedAt = new Date();
      });
    }

    // Update the order's status
    order.status = status;
    
    // Save the updated order
    await order.save();

    // Optionally create notification to user here

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/steps (admin) -> update step-by-step (pickup/washing/delivery)
export const updateOrderSteps = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { steps } = req.body;
    // steps example: [{ name: "pickup", completed: true, at: Date }, ...]
    // for simplicity store steps in order document (you could create separate collection)
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.steps = steps; // make sure orderSchema has steps field if you want this
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("package")
      .populate("paymentId")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};































// import catchAsync from "../utils/catchAsync.js";
// import OrderService from "../services/order.services.js";

// export default class OrderController {
//   static createOrder = catchAsync(async (req, res, next) => {
//     const order = await OrderService.createOrder(req.user.id, req.body);
//     res.status(201).json({ success: true, data: order });
//   });

//   static getUserOrders = catchAsync(async (req, res, next) => {
//     const orders = await OrderService.getUserOrders(req.user.id);
//     res.status(200).json({ success: true, data: orders });
//   });

//   static getOrderById = catchAsync(async (req, res, next) => {
//     const order = await OrderService.getOrderById(req.params.id);
//     res.status(200).json({ success: true, data: order });
//   });

//   static updateOrderStatus = catchAsync(async (req, res, next) => {
//     const { status } = req.body;
//     const updated = await OrderService.updateOrderStatus(req.params.id, status);
//     res.status(200).json({ success: true, data: updated });
//   });

//   static getAllOrdersAdmin = catchAsync(async (req, res, next) => {
//     const orders = await OrderService.getAllOrders();
//     res.status(200).json({ success: true, data: orders });
//   });
// }
