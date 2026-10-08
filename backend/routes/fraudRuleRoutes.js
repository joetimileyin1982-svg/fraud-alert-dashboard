const express = require("express");

const {
  getRules,
  getRule,
  createRule,
  updateRule,
  updateRuleStatus,
  deleteRule
} = require("../controllers/fraudRuleController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getRules);

router.get("/:id", protect, getRule);

router.post(
  "/",
  protect,
  authorize("admin"),
  createRule
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateRule
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateRuleStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteRule
);

module.exports = router;