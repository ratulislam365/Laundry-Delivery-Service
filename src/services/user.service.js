import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repositories.js";

export default class UserService {
  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user || user.isDeleted) throw new Error("User not found");
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }

  static async updateProfile(userId, body) {
    const { fullname, phonenumber, currentPassword, newPassword } = body;
    const user = await UserRepository.findByIdWithPassword(userId);
    console.log(user)
    if (!user || user.isDeleted) throw new Error("User not found");

    const updates = {};
    if (fullname) updates.fullname = fullname;
    if (phonenumber) updates.phoneNumber = phonenumber;

    if (newPassword) {
      if (!currentPassword) {
        throw new Error("Current password is required to set a new password");
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) throw new Error("Current password is incorrect");
      const hashed = await bcrypt.hash(newPassword, 10);
      updates.password = hashed;
    }

    const updatedUser = await UserRepository.updateUser(userId, updates);
    const { password, ...safeUser } = updatedUser.toObject();
    return safeUser;
  }

  static async deleteAccount(userId) {
    const deletedUser = await UserRepository.deleteUser(userId);
    if (!deletedUser) throw new Error("User not found");
    return true;
  }
}
