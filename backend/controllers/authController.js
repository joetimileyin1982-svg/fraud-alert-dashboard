const authService = require("../services/authService"); // 🌟 Note the two dots!
const User = require("../models/User");

const register = async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user
  });
};

const login = async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.status(200).json({
    success: true,
    ...result
  });
};

const me = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    user
  });
};

module.exports = {
  register,
  login,
  me
};