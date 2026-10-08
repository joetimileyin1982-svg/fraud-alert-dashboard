const FraudRule = require("../models/FraudRule");
const FraudAlert = require("../models/FraudAlert");
const Transaction = require("../models/Transaction");

const runFraudCheck = async (transaction) => {
  const rules = await FraudRule.find({
    isActive: true
  });

  const triggeredRules = [];

  for (const rule of rules) {
    let triggered = false;
    let explanation = "";

    if (
      rule.type === "large_transaction" &&
      transaction.amount >= rule.threshold
    ) {
      triggered = true;

      explanation = `Transaction amount of ${transaction.amount} is above the configured threshold.`;
    }

    if (
      rule.type === "unusual_time"
    ) {
      const hour = new Date(transaction.createdAt).getHours();

      if (hour >= 1 && hour <= 4) {
        triggered = true;

        explanation = "Transaction occurred during an unusual time window.";
      }
    }

    if (triggered) {
      triggeredRules.push({
        ruleId: rule._id,
        ruleName: rule.name,
        points: rule.points,
        explanation
      });
    }
  }

  const riskScore = Math.min(
    100,
    triggeredRules.reduce(
      (total, rule) => total + rule.points,
      0
    )
  );

  let severity = "low";

  if (riskScore >= 80) {
    severity = "critical";
  } else if (riskScore >= 60) {
    severity = "high";
  } else if (riskScore >= 30) {
    severity = "medium";
  }

  if (riskScore >= 30) {
    const alert = await FraudAlert.create({
      transactionId: transaction._id,
      customerId: transaction.customerId,
      riskScore,
      severity,
      reasons: triggeredRules
    });

    return {
      riskScore,
      severity,
      triggeredRules,
      alert
    };
  }

  return {
    riskScore,
    severity,
    triggeredRules,
    alert: null
  };
};

module.exports = {
  runFraudCheck
};