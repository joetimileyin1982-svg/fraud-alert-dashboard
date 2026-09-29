export const kpis = {
  fraudRate:      { value: 4.8,  delta: -0.7, label: "vs previous period" },
  highRiskRate:   { value: 7.2,  delta: -1.3, sub: "412 transactions" },
  avgRiskScore:   { value: 46.8, delta:  5.4, label: "vs previous period" },
  fraudExposure:  { value: "₦18.4M", delta: 12.6 },
};

export const riskTrend = [
  { date: "May 1", Safe: 6800, Suspicious: 2200, HighRisk: 900,  Critical: 320 },
  { date: "May 2", Safe: 7400, Suspicious: 2400, HighRisk: 1050, Critical: 380 },
  { date: "May 3", Safe: 7800, Suspicious: 2500, HighRisk: 1180, Critical: 420 },
  { date: "May 4", Safe: 8200, Suspicious: 2600, HighRisk: 1240, Critical: 460 },
  { date: "May 5", Safe: 8100, Suspicious: 2450, HighRisk: 1190, Critical: 410 },
  { date: "May 6", Safe: 7500, Suspicious: 2200, HighRisk: 1080, Critical: 360 },
  { date: "May 7", Safe: 8000, Suspicious: 2400, HighRisk: 1120, Critical: 390 },
];

export const riskDistribution = [
  { name: "Safe",       value: 72, color: "#34d399" },
  { name: "Suspicious", value: 16, color: "#fbbf24" },
  { name: "High Risk",  value: 8,  color: "#f472b6" },
  { name: "Critical",   value: 4,  color: "#ef4444" },
];

export const topRules = [
  { rule: "High Transaction Amount", triggers: 438, critical: 42 },
  { rule: "New Device",              triggers: 291, critical: 31 },
  { rule: "Velocity Rule",           triggers: 214, critical: 27 },
  { rule: "New Location",            triggers: 187, critical: 19 },
  { rule: "Multiple Accounts",       triggers: 132, critical: 12 },
];

export const riskByType = [
  { type: "Card",             transactions: 5420, highRisk: 8.4 },
  { type: "Bank Transfer",    transactions: 3180, highRisk: 6.9 },
  { type: "Mobile Wallet",    transactions: 2140, highRisk: 4.2 },
  { type: "Cash Withdrawal",  transactions: 1260, highRisk: 2.8 },
];

export const highRiskCustomers = [
  { name: "Patrick Star",  id: "CUS-1032", score: 94, txns: 32, signals: 5 },
  { name: "Luna Bloom",    id: "CUS-10417", score: 91, txns: 18, signals: 4 },
  { name: "Finn Harbor",   id: "CUS-10732", score: 87, txns: 26, signals: 3 },
  { name: "Coral Finch",   id: "CUS-10951", score: 83, txns: 14, signals: 3 },
  { name: "Maple Muffin",  id: "CUS-11023", score: 78, txns: 11, signals: 2 },
];

export const deviceRisk = {
  trusted:  8421,
  new:       934,
  suspicious: 218,
  highRisk:   73,
};

export const deviceTrend = [
  { date: "May 1", NewDevices: 480, TotalTxns: 520 },
  { date: "May 2", NewDevices: 620, TotalTxns: 580 },
  { date: "May 3", NewDevices: 890, TotalTxns: 740 },
  { date: "May 4", NewDevices: 760, TotalTxns: 900 },
  { date: "May 5", NewDevices: 820, TotalTxns: 1050 },
  { date: "May 6", NewDevices: 1050, TotalTxns: 1180 },
  { date: "May 7", NewDevices: 780, TotalTxns: 950 },
];

export const fraudByMerchant = [
  { merchant: "Krusty Mart",  value: "₦4.8M", rate: 12.6 },
  { merchant: "JellyPay",     value: "₦3.2M", rate: 8.9  },
  { merchant: "PayZone",      value: "₦2.7M", rate: 7.4  },
  { merchant: "QuickMart",    value: "₦1.9M", rate: 5.8  },
  { merchant: "ShopRite",     value: "₦1.4M", rate: 4.3  },
];

export const timeOfDayActivity = [
  { hour: "12 AM", count: 180 },
  { hour: "2 AM",  count: 120 },
  { hour: "4 AM",  count: 90  },
  { hour: "6 AM",  count: 210 },
  { hour: "8 AM",  count: 340 },
  { hour: "10 AM", count: 420 },
  { hour: "12 PM", count: 520 },
  { hour: "2 PM",  count: 640 },
  { hour: "4 PM",  count: 720 },
  { hour: "6 PM",  count: 840 },
  { hour: "8 PM",  count: 1060 },
  { hour: "10 PM", count: 720 },
];

export const emergingSignals = [
  {
    id: 1,
    title: "New-device activity increased 34%",
    sub: "Compared with previous 7 days",
    time: "2h ago",
    tone: "high",
  },
  {
    id: 2,
    title: "Unusual-location alerts increased 21%",
    sub: "Compared with previous 7 days",
    time: "4h ago",
    tone: "warning",
  },
  {
    id: 3,
    title: "Velocity rule triggered 86 more times",
    sub: "In the last 7 days",
    time: "6h ago",
    tone: "warning",
  },
  {
    id: 4,
    title: "False-positive rate decreased 4%",
    sub: "Compared with previous 7 days",
    time: "8h ago",
    tone: "low",
  },
];