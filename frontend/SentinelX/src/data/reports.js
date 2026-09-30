export const reportKpis = {
  generated: 128,
  resolved: 84,
  avgResolutionTime: "2h 14m",
  falsePositiveRate: "8.4%",
};

export const reportCatalog = [
  {
    id: "RPT-001",
    title: "Fraud Summary",
    description: "Fraud volume, resolution status, and overall trends for a selected period.",
    category: "Summary",
    icon: "chart",
    tone: "cyan",
    format: ["PDF", "CSV"],
  },
  {
    id: "RPT-002",
    title: "Alert Volume",
    description: "Alert counts by severity, source, and status over time.",
    category: "Alerts",
    icon: "bell",
    tone: "pink",
    format: ["PDF", "CSV"],
  },
  {
    id: "RPT-003",
    title: "Investigation Outcomes",
    description: "Breakdown of case decisions: resolved, escalated, false positive, blocked.",
    category: "Cases",
    icon: "folder",
    tone: "amber",
    format: ["PDF", "CSV"],
  },
  {
    id: "RPT-004",
    title: "Top Fraud Rules",
    description: "Which rules triggered most often and their contribution to high-risk cases.",
    category: "Rules",
    icon: "shield",
    tone: "green",
    format: ["PDF", "CSV"],
  },
  {
    id: "RPT-005",
    title: "High-Risk Customers",
    description: "Customers with the highest risk scores and their recent activity.",
    category: "Customers",
    icon: "users",
    tone: "purple",
    format: ["PDF", "CSV"],
  },
  {
    id: "RPT-006",
    title: "Device Intelligence",
    description: "New devices, shared devices, and unusual IP activity across the period.",
    category: "Devices",
    icon: "cpu",
    tone: "cyan",
    format: ["PDF", "CSV"],
  },
];

export const recentReports = [
  {
    id: "REP-2026-0412",
    title: "Fraud Summary",
    format: "PDF",
    size: "1.4 MB",
    period: "Apr 28 – May 4, 2026",
    generatedBy: "Daisy H.",
    generatedAt: "May 5, 2026 · 08:12 AM",
    status: "Ready",
  },
  {
    id: "REP-2026-0411",
    title: "Alert Volume",
    format: "CSV",
    size: "320 KB",
    period: "Apr 28 – May 4, 2026",
    generatedBy: "Daisy H.",
    generatedAt: "May 5, 2026 · 08:10 AM",
    status: "Ready",
  },
  {
    id: "REP-2026-0410",
    title: "Investigation Outcomes",
    format: "PDF",
    size: "890 KB",
    period: "Apr 21 – Apr 27, 2026",
    generatedBy: "Marcus B.",
    generatedAt: "Apr 28, 2026 · 06:45 PM",
    status: "Ready",
  },
  {
    id: "REP-2026-0409",
    title: "Top Fraud Rules",
    format: "PDF",
    size: "612 KB",
    period: "Apr 21 – Apr 27, 2026",
    generatedBy: "Daisy H.",
    generatedAt: "Apr 28, 2026 · 10:20 AM",
    status: "Ready",
  },
  {
    id: "REP-2026-0408",
    title: "Device Intelligence",
    format: "CSV",
    size: "510 KB",
    period: "Apr 14 – Apr 20, 2026",
    generatedBy: "Admin",
    generatedAt: "Apr 21, 2026 · 09:00 AM",
    status: "Ready",
  },
  {
    id: "REP-2026-0407",
    title: "High-Risk Customers",
    format: "PDF",
    size: "1.1 MB",
    period: "Apr 14 – Apr 20, 2026",
    generatedBy: "Marcus B.",
    generatedAt: "Apr 21, 2026 · 08:30 AM",
    status: "Ready",
  },
];

export const reportSummary = {
  "RPT-001": {
    sections: [
      "Total transactions reviewed",
      "Fraud vs legitimate split",
      "Cases resolved by analyst",
      "Average resolution time",
      "Top 5 triggered rules",
    ],
  },
  "RPT-002": {
    sections: [
      "Alerts by severity",
      "Alerts by source",
      "Alert volume trend",
      "Median time to first review",
    ],
  },
  "RPT-003": {
    sections: [
      "Cases by outcome",
      "Cases by analyst",
      "Escalation reasons",
      "False positive breakdown",
    ],
  },
  "RPT-004": {
    sections: [
      "Rule trigger frequency",
      "Rule contribution to high-risk cases",
      "False positive rate per rule",
    ],
  },
  "RPT-005": {
    sections: [
      "Top 20 high-risk customers",
      "Risk score distribution",
      "Customer activity summary",
    ],
  },
  "RPT-006": {
    sections: [
      "New devices detected",
      "Shared device fingerprints",
      "Unusual IP activity",
      "Device trust distribution",
    ],
  },
};