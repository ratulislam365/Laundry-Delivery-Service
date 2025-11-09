import express from "express";
import { getAllOrdersAdmin } from "../controllers/order.controller.js";
import { verifyAccessToken as protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getAllOrdersAdmin);

export default router;
