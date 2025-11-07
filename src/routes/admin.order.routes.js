import express from "express";
import { getAllOrdersAdmin } from "../controllers/order.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, restrictTo("admin"), getAllOrdersAdmin);

export default router;
