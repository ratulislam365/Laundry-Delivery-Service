import express from "express";
import {
  getOverview,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
} from "../../controllers/admin-controllers/admin.user.controllers.js";

const router = express.Router();

// Overview Cards
router.get("/overview", getOverview);

// CRUD Routes
router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Deactivate
router.patch("/:id/deactivate", deactivateUser);

export default router;
