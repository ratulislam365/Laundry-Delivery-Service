import express from "express";
import OrderController from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, OrderController.createOrder);
router.get("/", protect, OrderController.getUserOrders);
router.get("/:id", protect, OrderController.getOrderById);
router.patch("/:id/status", protect, OrderController.updateOrderStatus);

export default router;
