import UserService from "../services/user.service.js";

export default class UserController {
static async getProfile(req, res, next) {
    try {
      // console.log('req.user:', req.user);
      // console.log('req.user._id:', req.user._id);
      const userId = req.user._id;
      const user = await UserService.getProfile(userId);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
static async updateProfile(req, res, next) {
    try {
      console.log("Hey")
      const userId = req.user._id;
      const updated = await UserService.updateProfile(userId, req.body);
      res.json({ success: true, message: "Profile updated successfully", data: updated });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }
static async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;
      await UserService.deleteAccount(userId);
      res.json({ success: true, message: "Account deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
static async getHelp(req, res) {
    res.json({
      success: true,
      data: {
        instagram: "https://instagram.com/laundryhub",
        email: "support@laundryhub.com",
        twitter: "https://twitter.com/laundryhub",
        website: "https://www.laundryhub.com"
      }

    });

  }

}
