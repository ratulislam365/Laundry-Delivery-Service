import express from "express";
import OrderController from "../controllers/order.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, restrictTo("admin"), OrderController.getAllOrdersAdmin);

export default router;
