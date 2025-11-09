import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import { signupSchema, verifyOtpSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schemas.js';
import { optionalAccessToken } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/signup', validationMiddleware(signupSchema), AuthController.signup);
authRouter.post('/verify-otp', validationMiddleware(verifyOtpSchema), AuthController.verifyOtp);
authRouter.post('/login', validationMiddleware(loginSchema), AuthController.login);
authRouter.post('/forgot-password', validationMiddleware(forgotPasswordSchema), AuthController.forgotPassword);
authRouter.post('/reset-password', validationMiddleware(resetPasswordSchema), AuthController.resetPassword);
authRouter.post("/logout", optionalAccessToken, AuthController.logout);
