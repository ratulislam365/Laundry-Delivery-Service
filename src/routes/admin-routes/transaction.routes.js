import express from "express";
import { getRecentTransactions } from "../../controllers/admin-controllers/transacrion.controller.js";

const router = express.Router();

router.get("/recent", getRecentTransactions);

export default router;
