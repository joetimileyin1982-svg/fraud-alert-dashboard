const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    // 🌟 Fix: This passes req.body (including name, email, password, AND phone) to the service
    const user = await authService.registerUser(req.body);
    
    return res.status(201).json({
      success: true,
      message: "Registered successfully with email and phone verified",
      user
    });
  } catch (error) {
    // Prevents terminal crash and returns the exact validation failure message to Postman instead
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};
