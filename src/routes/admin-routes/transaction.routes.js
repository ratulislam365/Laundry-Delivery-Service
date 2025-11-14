// src/routes/transaction.routes.js
import express from "express";
import { getRecentTransactions , addTransaction} from "../../controllers/admin-controllers/transaction.controller.js";

const router = express.Router();

router.get("/", getRecentTransactions);
router.post("/add",addTransaction)

export default router;
