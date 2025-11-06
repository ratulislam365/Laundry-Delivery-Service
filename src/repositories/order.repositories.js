import Order from "../models/order.model.js";

export default class OrderRepository {
  static async create(orderData) {
    return await Order.create(orderData);
  }

  static async findByUser(userId) {
    return await Order.find({ user: userId }).populate("package");
  }

  static async findById(orderId) {
    return await Order.findById(orderId).populate("user").populate("package");
  }

  static async findAll() {
    return await Order.find().populate("user").populate("package");
  }

  static async updateStatus(orderId, status) {
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }
}
