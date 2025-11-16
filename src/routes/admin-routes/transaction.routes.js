import express from "express";
import {
  getRecentTransactions,
  getTransactionById,
  updateTransactionStatus
} from "../../controllers/admin-controllers/transaction.controller.js";

import { isAdmin } from "../../middlewares/admin.middleware.js";

const router = express.Router();

// GET recent 50 transactions
router.get("/transactions/recent", isAdmin, getRecentTransactions);

// GET single transaction
router.get("/transactions/:id", isAdmin, getTransactionById);

// PATCH Update transaction status
router.patch("/transactions/:id/status", isAdmin, updateTransactionStatus);

export default router;
