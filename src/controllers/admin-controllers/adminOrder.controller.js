import OrderService from "../../services/order.service.js";

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await OrderService.getRecentOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
