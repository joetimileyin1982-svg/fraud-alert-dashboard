const express = require("express");

const {
  createTransaction,
  getTransactions,
  getTransaction
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createTransaction
);

router.get(
  "/",
  protect,
  getTransactions
);

router.get(
  "/:id",
  protect,
  getTransaction
);

module.exports = router;
