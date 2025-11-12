import Order from "../models/order.model.js";

class OrderService {
  static async getRecentOrders(limit = 10) {
    return await Order.find().sort({ createdAt: -1 }).limit(limit);
  }
}

export default OrderService;
