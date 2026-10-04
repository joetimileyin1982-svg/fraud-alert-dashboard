const calculateSeverity = (score) => {
  if (score >= 80) {
    return "critical";
  }

  if (score >= 60) {
    return "high";
  }

  if (score >= 30) {
    return "medium";
  }

  return "low";
};

const calculateRiskScore = (rules) => {
  const total = rules.reduce(
    (sum, rule) => sum + rule.points,
    0
  );

  return Math.min(total, 100);
};

module.exports = {
  calculateRiskScore,
  calculateSeverity
};