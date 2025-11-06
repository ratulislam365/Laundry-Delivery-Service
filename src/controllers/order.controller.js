import catchAsync from "../utils/catchAsync.js";
import OrderService from "../services/order.services.js";

export default class OrderController {
  static createOrder = catchAsync(async (req, res, next) => {
    const order = await OrderService.createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, data: order });
  });

  static getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await OrderService.getUserOrders(req.user.id);
    res.status(200).json({ success: true, data: orders });
  });

  static getOrderById = catchAsync(async (req, res, next) => {
    const order = await OrderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, data: order });
  });

  static updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const updated = await OrderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ success: true, data: updated });
  });

  static getAllOrdersAdmin = catchAsync(async (req, res, next) => {
    const orders = await OrderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  });
}
