import User from "../../models/user.model.js";

// 🧮 Overview data for dashboard cards
export const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ packageStatus: "Active" });
    const appUsers = await User.countDocuments({ platform: "App" });
    const websiteUsers = await User.countDocuments({ platform: "Website" });

    res.json({ totalUsers, activeUsers, appUsers, websiteUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all users or search by name/email
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➕ Add new user
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, platform, packageStatus } = req.body;

    // Auto generate userId
    const count = await User.countDocuments();
    const userId = `U${String(count + 1).padStart(3, "0")}`;

    const newUser = new User({
      userId,
      name,
      email,
      phone,
      platform,
      packageStatus,
    });

    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👁 View user details
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update user info
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚫 Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deactivated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
