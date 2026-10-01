export const FRAUD_RULES_LIST = [
  {
    id: "RULE-001",
    key: "HIGH_AMOUNT",
    label: "High Transaction Amount",
    description: "Flags transactions above the configured threshold.",
    condition: "Amount > ₦500,000",
    category: "Amount",
    weight: 30,
    active: true,
    triggers: 438,
    falsePositives: 52,
    createdAt: "2025-08-14",
    updatedAt: "2026-04-28",
  },
  {
    id: "RULE-002",
    key: "NEW_DEVICE",
    label: "New Device",
    description: "First-time device fingerprint for this customer.",
    condition: "Device not previously seen for customer",
    category: "Device",
    weight: 20,
    active: true,
    triggers: 291,
    falsePositives: 23,
    createdAt: "2025-08-14",
    updatedAt: "2026-05-01",
  },
  {
    id: "RULE-003",
    key: "NEW_LOCATION",
    label: "New Location",
    description: "Transaction originates from a new country or city.",
    condition: "Location differs from customer profile",
    category: "Location",
    weight: 20,
    active: true,
    triggers: 187,
    falsePositives: 28,
    createdAt: "2025-08-14",
    updatedAt: "2026-04-15",
  },
  {
    id: "RULE-004",
    key: "VELOCITY",
    label: "Velocity Rule",
    description: "Multiple transactions within a very short window.",
    condition: "> 3 transactions in 60 seconds",
    category: "Behavior",
    weight: 15,
    active: true,
    triggers: 214,
    falsePositives: 39,
    createdAt: "2025-09-02",
    updatedAt: "2026-04-20",
  },
  {
    id: "RULE-005",
    key: "MULTIPLE_ACCTS",
    label: "Multiple Accounts",
    description: "Same device linked to multiple customer accounts.",
    condition: "> 2 accounts on same device in 24h",
    category: "Device",
    weight: 10,
    active: false,
    triggers: 132,
    falsePositives: 32,
    createdAt: "2025-10-11",
    updatedAt: "2026-04-30",
  },
  {
    id: "RULE-006",
    key: "ODD_HOURS",
    label: "Unusual Time",
    description: "Transaction initiated outside the customer's normal hours.",
    condition: "Time outside customer's typical 6AM–11PM window",
    category: "Behavior",
    weight: 5,
    active: true,
    triggers: 88,
    falsePositives: 6,
    createdAt: "2025-11-20",
    updatedAt: "2026-03-08",
  },
];

export const FRAUD_RULES = Object.fromEntries(
  FRAUD_RULES_LIST.map((r) => [
    r.key,
    { label: r.label, weight: r.weight },
  ])
);

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