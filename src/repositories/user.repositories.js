import User from "../models/user.model.js";

class UserRepository {
  static async findById(id) {
    return await User.findById(id);
  }

  static async findByIdWithPassword(id) {
    return await User.findById(id).select("+password");
  }

  static async findByEmail(email, select) {
    return await User.findOne({ email }).select(select);
  }

  static async findByPhone(phonenumber) {
    return await User.findOne({ phonenumber });
  }

  static async findByEmailOrPhone(identifier) {
    return await User.findOne({
      $or: [{ email: identifier }, { phonenumber: identifier }]
    });
  }

  static async findUserWithPasswordByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  static async getAllUsers() {
    return await User.find();
  }

  static async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  static async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async deleteUser(id) {
    return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }
}

export default UserRepository;
