import Notification from "../../models/admin.notification.model.js";
import User from "../../models/user.model.js";

// 📨 Send Notification to specific user
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const { id } = req.params; // user ID from URL

    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create new notification
    const notification = await Notification.create({
      userId: id,
      title,
      message,
      type,
    });

    // Future: Here you can integrate Firebase Cloud Messaging (FCM) or Email service

    res.status(201).json({
      message: "Notification sent successfully",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all notifications for one user (optional)
export const getUserNotifications = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const notifications = await Notification.find({ userId: id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params; // notificationId
    const notif = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.json({ message: "Marked as read", notif });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
