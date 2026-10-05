const express = require("express");

const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  updateCustomerStatus
} = require("../controllers/customerController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  createCustomer
);

router.get(
  "/",
  protect,
  getCustomers
);

router.get(
  "/:id",
  protect,
  getCustomer
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateCustomer
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateCustomerStatus
);

module.exports = router;
