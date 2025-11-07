// src/middlewares/admin.middleware.js
// Named export: isAdmin (so your import { isAdmin } ... ) ঠিক থাকবে

export const isAdmin = (req, res, next) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    // সব ঠিক থাকলে proceed
    next();
  } catch (err) {
    next(err);
  }
};
