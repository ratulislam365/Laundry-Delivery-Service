import express from "express";
import UserController from "../controllers/user.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/validation.middleware.js";
import { updateUserSchema } from "../schemas/user.schema.js";



const router = express.Router();

router.get("/profile" , protect , UserController.getProfile)
router.patch("/update", protect, validateSchema(updateUserSchema), UserController.updateProfile);
router.delete("/delete", protect, UserController.deleteAccount);
router.get("/help", UserController.getHelp);


export default router;
