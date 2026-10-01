export const adminKpis = {
  transactionsLogged: { value: 12000, delta: 8, sub: "this period" },
  activeAnalysts:     { value: 24,    sub: "21 online" },
  activeRules:        { value: 38,    sub: "3 updated today" },
  pendingReviews:     { value: 127,   sub: "34 critical" },
  systemAlerts:       { value: 6,     sub: "2 require attention" },
};

export const transactionActivity = [
  { day: "Mon", logged: 8200,  approved: 7100, flagged: 900,  reviewed: 500 },
  { day: "Tue", logged: 9100,  approved: 7800, flagged: 1050, reviewed: 620 },
  { day: "Wed", logged: 9800,  approved: 8400, flagged: 1180, reviewed: 700 },
  { day: "Thu", logged: 10400, approved: 8900, flagged: 1240, reviewed: 760 },
  { day: "Fri", logged: 11200, approved: 9500, flagged: 1420, reviewed: 860 },
  { day: "Sat", logged: 10100, approved: 8600, flagged: 1280, reviewed: 740 },
  { day: "Sun", logged: 9300,  approved: 7900, flagged: 1100, reviewed: 660 },
];

export const fraudRateTrend = [
  { date: "Apr 08", rate: 3.21 },
  { date: "Apr 09", rate: 3.44 },
  { date: "Apr 10", rate: 3.28 },
  { date: "Apr 11", rate: 3.62 },
  { date: "Apr 12", rate: 3.85 },
  { date: "Apr 13", rate: 3.71 },
  { date: "Apr 14", rate: 3.92 },
  { date: "Apr 15", rate: 4.12 },
  { date: "Apr 16", rate: 4.35 },
  { date: "Apr 17", rate: 4.18 },
  { date: "Apr 18", rate: 4.48 },
  { date: "Apr 19", rate: 4.72 },
  { date: "Apr 20", rate: 4.51 },
  { date: "Apr 21", rate: 4.83 },
  { date: "Apr 22", rate: 5.02 },
  { date: "Apr 23", rate: 4.88 },
  { date: "Apr 24", rate: 5.21 },
  { date: "Apr 25", rate: 5.44 },
  { date: "Apr 26", rate: 5.18 },
  { date: "Apr 27", rate: 5.52 },
  { date: "Apr 28", rate: 5.71 },
  { date: "Apr 29", rate: 5.48 },
  { date: "Apr 30", rate: 5.82 },
  { date: "May 01", rate: 6.02 },
  { date: "May 02", rate: 5.78 },
  { date: "May 03", rate: 6.14 },
  { date: "May 04", rate: 6.32 },
  { date: "May 05", rate: 6.08 },
  { date: "May 06", rate: 6.41 },
  { date: "May 07", rate: 6.68 },
];

export const analystActivity = [
  { name: "Daisy Harper",   investigations: 42, reviewed: 184, escalated: 8 },
  { name: "Alex Morgan",    investigations: 37, reviewed: 162, escalated: 6 },
  { name: "Sarah Williams", investigations: 31, reviewed: 149, escalated: 4 },
  { name: "Marcus Bell",    investigations: 28, reviewed: 132, escalated: 5 },
  { name: "Priya Nair",     investigations: 22, reviewed: 118, escalated: 3 },
];

export const topRules = [
  { rule: "High Transaction Amount", triggered: 438, critical: 42, active: true },
  { rule: "New Device",              triggered: 291, critical: 31, active: true },
  { rule: "Velocity Rule",           triggered: 214, critical: 27, active: true },
  { rule: "Unusual Location",        triggered: 187, critical: 19, active: true },
  { rule: "Multiple Accounts",       triggered: 132, critical: 12, active: false },
];

export const riskDistribution = [
  { name: "Safe",       value: 72, color: "#34d399" },
  { name: "Suspicious", value: 16, color: "#fbbf24" },
  { name: "High Risk",  value: 8,  color: "#f472b6" },
  { name: "Critical",   value: 4,  color: "#ef4444" },
];

export const pendingReviews = {
  critical: 34,
  highRisk: 52,
  suspicious: 41,
  total: 127,
};

export const recentAdminActivity = [
  {
    id: 1,
    text: "Daisy Harper was added as Fraud Analyst",
    time: "10 minutes ago",
    tone: "green",
  },
  {
    id: 2,
    text: "High Transaction Amount rule updated",
    time: "32 minutes ago",
    tone: "cyan",
  },
  {
    id: 3,
    text: "Monthly fraud report generated",
    time: "1 hour ago",
    tone: "purple",
  },
  {
    id: 4,
    text: "User account deactivated",
    time: "2 hours ago",
    tone: "warn",
  },
  {
    id: 5,
    text: "Rule threshold adjusted: New Device 20 → 25",
    time: "Yesterday · 04:22 PM",
    tone: "cyan",
  },
];

export const systemAlerts = [
  { id: 1, tone: "warn",     text: "3 fraud rules have not been reviewed recently" },
  { id: 2, tone: "warn",     text: "Analyst workload is above normal" },
  { id: 3, tone: "info",     text: "Monthly report is ready" },
  { id: 4, tone: "critical", text: "Authentication service configuration requires attention" },
];