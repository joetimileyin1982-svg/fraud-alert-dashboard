const express = require("express");

const {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getUser
);

router.patch(
  "/:id/role",
  protect,
  authorize("admin"),
  updateUserRole
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus
);

module.exports = router;
