import AppError from "../utils/appError.js";
import UserRepository from "../repositories/user.repositories.js";

export default class UserController {
  static async getProfile(req, res, next) {
    try {
      const user = await UserRepository.findById(req.user._id);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      console.log(req.user._id)
      const updatedUser = await UserRepository.updateUser(req.user._id, req.body);
      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAccount(req, res, next) {
    try {
      await UserRepository.deleteUser(req.user._id);
      res.status(204).json({
        success: true,
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHelp(req, res, next) {
    res.status(200).json({
      success: true,
      message: "Help is on the way!",
    });
  }
}