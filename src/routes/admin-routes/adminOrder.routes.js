import express from "express";
import { getRecentOrders } from "../../controllers/admin-controllers/adminOrder.controller.js";

const router = express.Router();

router.get("/recent", getRecentOrders);

export default router;
