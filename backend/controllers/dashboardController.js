const Transaction = require("../models/Transaction");
const FraudAlert = require("../models/FraudAlert");

const getSummary = async (req, res) => {
  const totalTransactions =
    await Transaction.countDocuments();

  const totalAlerts =
    await FraudAlert.countDocuments();

  const openAlerts =
    await FraudAlert.countDocuments({
      status: "open"
    });

  const completedTransactions =
    await Transaction.countDocuments({
      status: "completed"
    });

  const fraudRate =
    totalTransactions === 0
      ? 0
      : ((totalAlerts / totalTransactions) * 100).toFixed(2);

  res.json({
    success: true,
    summary: {
      totalTransactions,
      totalAlerts,
      openAlerts,
      completedTransactions,
      fraudRate: Number(fraudRate)
    }
  });
};

const getRecentAlerts = async (req, res) => {
  const alerts = await FraudAlert.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("transactionId")
    .populate("customerId");

  res.json({
    success: true,
    alerts
  });
};

module.exports = {
  getSummary,
  getRecentAlerts
};