import express from "express";
import {
  sendNotification,
  getUserNotifications,
  markAsRead,
} from "../../controllers/admin-controllers/admin.notification.controller.js";

const router = express.Router();

// 📨 Send notification to specific user
router.post("/send/:id", sendNotification);

// 📋 Get all notifications for one user
router.get("/user/:id", getUserNotifications);

// ✅ Mark as read
router.patch("/:id/read", markAsRead);

export default router;
