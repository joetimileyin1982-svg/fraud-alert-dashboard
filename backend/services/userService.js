const User = require("../models/User");

const getUsers = async () => {
  return User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

const updateUserRole = async (id, role) => {
  return User.findByIdAndUpdate(
    id,
    { role },
    {
      new: true,
      runValidators: true
    }
  ).select("-password");
};

const updateUserStatus = async (id, status) => {
  return User.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true
    }
  ).select("-password");
};

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus
};
