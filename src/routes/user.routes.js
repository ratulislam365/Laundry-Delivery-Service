import express from "express";
import UserController from "../controllers/user.controllers.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import validateSchema from "../middlewares/validation.middleware.js";
import { updateUserSchema } from "../schemas/user.schema.js";



const router = express.Router();

router.get("/profile" , verifyAccessToken , UserController.getProfile)
router.patch("/update", verifyAccessToken, validateSchema(updateUserSchema), UserController.updateProfile);
router.delete("/delete", verifyAccessToken, UserController.deleteAccount);
router.get("/help", UserController.getHelp);


export default router;
