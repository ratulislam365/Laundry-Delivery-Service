 import OrderService from "../../services/order.service.js";
import { AdminOrder } from "../../models/admin.order.model.js";

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await OrderService.getRecentOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createOrder = async (req, res) => {
  try {
    const order = await AdminOrder.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};
