import express from "express";
import {
  createTransaction,
  stripeWebhook
} from "../controllers/payment.controller.js";

const router = express.Router();

// Create transaction (When user pays)
router.post("/create-transaction", createTransaction);

// Stripe or payment webhook
router.post("/webhook", stripeWebhook);

export default router;
