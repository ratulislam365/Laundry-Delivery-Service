import AuthService from '../services/auth.services.js';
import User from '../models/user.model.js';

export default class AuthController {
  static async signup(req, res, next) {
    try {
      const { fullName, emailOrPhone, password } = req.body;
      const response = await AuthService.signup({ fullName, emailOrPhone, password });
      res.status(201).json({  
        success: true,
        data: response
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyOtp(req, res, next) {
    try {
      const { emailOrPhone, otp } = req.body;
      const { accessToken, refreshToken } = await AuthService.verifyOtp(emailOrPhone, otp);
      res.json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await AuthService.login(email, password);
      res.json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const message = await AuthService.forgotPassword(email);
      res.json({ message });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { email, otp, password } = req.body;
      const message = await AuthService.resetPassword(email, otp, password);
      res.json({ message });
    } catch (err) {
      next(err);
    }
  }

    static async logout(req, res, next) {
    try {
      if (req.user && req.user._id) {
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { refreshToken: null });
      }

      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
