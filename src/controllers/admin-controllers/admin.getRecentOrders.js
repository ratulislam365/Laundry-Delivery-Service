import { Order } from "../models/order.model.js";

export const getRecentOrders = async (req, res) => {
  try {
    // pagination future use
    const limit = Number(req.query.limit) || 10;

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("orderId customerName serviceType status platform createdAt");

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
      error: error.message,
    });
  }
};
