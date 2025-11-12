import express from "express";
import { getDashboardStats } from "../../controllers/admin-controllers/adminDashboard.controller.js";


const router = express.Router();

router.get("/dashboard" , getDashboardStats);

export default router;
