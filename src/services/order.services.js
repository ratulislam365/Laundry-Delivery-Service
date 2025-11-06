import AppError from "../utils/appError.js";
import OrderRepository from "../repositories/order.repositories.js";

export default class OrderService {
  static async createOrder(userId, orderBody) {
    const total = (orderBody.pricePerBag * orderBody.bags) + orderBody.serviceFee;

    const order = await OrderRepository.create({
      ...orderBody,
      user: userId,
      totalAmount: total,
    });

    return order;
  }

  static async getUserOrders(userId) {
    const orders = await OrderRepository.findByUser(userId);
    if (!orders.length) throw new AppError("No orders found", 404);
    return orders;
  }

  static async getOrderById(orderId) {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    return order;
  }

  static async updateOrderStatus(orderId, status) {
    const validStatus = ["pickup", "washing", "delivery", "completed"];
    if (!validStatus.includes(status)) {
      throw new AppError("Invalid status update", 400);
    }
    const updated = await OrderRepository.updateStatus(orderId, status);
    if (!updated) throw new AppError("Order not found", 404);
    return updated;
  }

  static async getAllOrders() {
    return await OrderRepository.findAll();
  }
}
