const userService = require("../services/userService");

const getUsers = async (req, res) => {
  const users = await userService.getUsers();

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
};

const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);

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

const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role"
    });
  }

  const user = await userService.updateUserRole(
    req.params.id,
    role
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user
  });
};

const updateUserStatus = async (req, res) => {
  const { status } = req.body;

  if (!["active", "suspended"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status"
    });
  }

  const user = await userService.updateUserStatus(
    req.params.id,
    status
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    user
  });
};

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus
};
