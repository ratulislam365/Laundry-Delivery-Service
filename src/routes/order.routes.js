import express from "express";
import * as orderCtrl from "../controllers/order.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// create order (checkout) - authenticated
router.post("/", verifyAccessToken, orderCtrl.createOrder);

// get logged-in user's orders
router.get("/my-orders", verifyAccessToken, orderCtrl.getMyOrders);

// get single order (owner or admin)
router.get("/:id", verifyAccessToken, orderCtrl.getOrderById);

// cancel order (owner)
router.delete("/:id/cancel", verifyAccessToken, orderCtrl.cancelOrder);

// admin updates whole order status (pickup -> washing -> delivery -> completed)
router.put("/:id/status", verifyAccessToken, isAdmin, orderCtrl.updateOrderStatus);

// update steps (e.g., mark step complete) - can be used by staff
router.put("/:id/steps", verifyAccessToken, isAdmin, orderCtrl.updateOrderSteps);

// PATCH update whole order (owner or admin)
router.patch("/:id", verifyAccessToken, orderCtrl.updateOrder);


export default router;



















// import express from "express";
// import OrderController from "../controllers/order.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// router.post("/", protect, OrderController.createOrder);
// router.get("/", protect, OrderController.getUserOrders);
// router.get("/:id", protect, OrderController.getOrderById);
// router.patch("/:id/status", protect, OrderController.updateOrderStatus);

// export default router;
