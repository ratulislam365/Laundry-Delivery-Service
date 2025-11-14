import express from "express";
import { getRecentOrders , createOrder} from "../../controllers/admin-controllers/adminOrder.controller.js";

const router = express.Router();

router.get("/recent-orders", getRecentOrders);
router.post("/create-order",createOrder)

export default router;
