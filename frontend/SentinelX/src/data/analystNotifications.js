export const analystNotifications = [
  {
    id: "NTL-001",
    title: "Critical fraud alert requires immediate review",
    description:
      "TXN-92830 — Luna Bloom. Multiple high-value transactions from a new device (SIM swap suspected).",
    category: "Alerts",
    severity: "critical",
    timestamp: "2026-05-07T10:45:00Z",
    read: false,
    action: { label: "Open Case", to: "/analyst/investigations/new?txn=TXN-92830" },
  },
  {
    id: "NTL-002",
    title: "High-risk transaction flagged",
    description:
      "TXN-92829 — Finn Harbor. Risk score 82. Unusual location + high velocity pattern.",
    category: "Alerts",
    severity: "warning",
    timestamp: "2026-05-07T10:32:00Z",
    read: false,
    action: { label: "Review Transaction", to: "/analyst/transactions?txn=TXN-92829" },
  },
  {
    id: "NTL-003",
    title: "New device detected on a monitored account",
    description:
      "Maple Muffin's account showed a first-time device fingerprint during a transaction from London, UK.",
    category: "Alerts",
    severity: "warning",
    timestamp: "2026-05-07T10:15:00Z",
    read: false,
    action: { label: "View Customer", to: "/analyst/customers?search=Maple%20Muffin" },
  },
  {
    id: "NTL-004",
    title: "Investigation assigned to you",
    description:
      "INV-10293 · Patrick Star — flagged for manual review by the fraud engine.",
    category: "Cases",
    severity: "info",
    timestamp: "2026-05-07T09:48:00Z",
    read: false,
    action: { label: "Open Investigation", to: "/analyst/investigations" },
  },
  {
    id: "NTL-005",
    title: "Case escalated to you",
    description:
      "INV-10288 · Ocean Blue — escalated by Marcus Bell after reviewing the transaction chain.",
    category: "Cases",
    severity: "warning",
    timestamp: "2026-05-07T09:12:00Z",
    read: false,
    action: { label: "Open Investigation", to: "/analyst/investigations" },
  },
  {
    id: "NTL-006",
    title: "Investigation resolved by teammate",
    description:
      "INV-10286 · Lily Rose — marked as false positive by Sarah Williams.",
    category: "Cases",
    severity: "success",
    timestamp: "2026-05-07T08:47:00Z",
    read: true,
    action: null,
  },
  {
    id: "NTL-007",
    title: "Alert volume spike detected",
    description:
      "32 new alerts generated in the last hour — above the normal baseline of ~8/hour.",
    category: "Alerts",
    severity: "warning",
    timestamp: "2026-05-07T08:22:00Z",
    read: true,
    action: { label: "View Threat Feed", to: "/analyst/investigations" },
  },
  {
    id: "NTL-008",
    title: "Customer risk level increased",
    description:
      "Coral Finch moved from High Risk to Critical following recent transaction activity.",
    category: "Customers",
    severity: "warning",
    timestamp: "2026-05-07T07:45:00Z",
    read: true,
    action: { label: "View Customer", to: "/analyst/customers?search=Coral%20Finch" },
  },
  {
    id: "NTL-009",
    title: "Investigation note added to your case",
    description:
      "Marcus Bell added a note to INV-10293 — flagged the transaction chain for further review.",
    category: "Cases",
    severity: "info",
    timestamp: "2026-05-07T07:12:00Z",
    read: true,
    action: { label: "Open Investigation", to: "/analyst/investigations" },
  },
  {
    id: "NTL-010",
    title: "Daily risk analytics summary ready",
    description:
      "May 7 summary: 4.8% fraud rate, 12 critical cases, 42 pending reviews.",
    category: "Reports",
    severity: "info",
    timestamp: "2026-05-07T06:00:00Z",
    read: true,
    action: { label: "Open Analytics", to: "/analyst/risk-analytics" },
  },
  {
    id: "NTL-011",
    title: "Suspicious behavior pattern detected",
    description:
      "Mr. Krabs triggered 4 fraud rules in a single transaction (amount, device, location, velocity).",
    category: "Alerts",
    severity: "critical",
    timestamp: "2026-05-06T22:18:00Z",
    read: true,
    action: { label: "Review Transaction", to: "/analyst/transactions" },
  },
  {
    id: "NTL-012",
    title: "Investigation closed with no action",
    description:
      "INV-10275 · Coral Finch — resolved and archived without escalation.",
    category: "Cases",
    severity: "success",
    timestamp: "2026-05-06T18:30:00Z",
    read: true,
    action: null,
  },
];

export const ANALYST_NOTIFICATION_CATEGORIES = [
  "All",
  "Alerts",
  "Cases",
  "Customers",
  "Reports",
];

export const ANALYST_NOTIFICATION_SEVERITIES = [
  "All",
  "Critical",
  "Warning",
  "Info",
  "Success",
];