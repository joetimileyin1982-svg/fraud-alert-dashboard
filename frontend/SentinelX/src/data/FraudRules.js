export const FRAUD_RULES = {
  HIGH_AMOUNT:    { label: "High Amount",       weight: 30 },
  NEW_DEVICE:     { label: "New Device",        weight: 20 },
  NEW_LOCATION:   { label: "New Location",      weight: 20 },
  VELOCITY:       { label: "Velocity",          weight: 15 },
  MULTIPLE_ACCTS: { label: "Multiple Accounts", weight: 10 },
  ODD_HOURS:      { label: "Unusual Time",      weight: 5  },
};

export function computeRiskScore(ruleKeys = []) {
  return ruleKeys.reduce(
    (sum, key) => sum + (FRAUD_RULES[key]?.weight || 0),
    0
  );
}

export function riskBucket(score) {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "review";
  return "low";
}

export function riskLabel(score) {
  if (score >= 70) return "Critical";
  if (score >= 50) return "High Risk";
  if (score >= 25) return "Suspicious";
  return "Safe";
}