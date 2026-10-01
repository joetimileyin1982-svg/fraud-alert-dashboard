export const adminNotifications = [
  {
    id: "ANT-001",
    title: "Authentication service configuration requires attention",
    description:
      "The Authentication service entered a degraded state. Review the configuration and restart the service if needed.",
    category: "System",
    severity: "critical",
    timestamp: "2026-05-07T10:32:00Z",
    read: false,
    action: { label: "View System Status", to: "/admin/dashboard" },
  },
  {
    id: "ANT-002",
    title: "3 fraud rules have not been reviewed recently",
    description:
      "Rules older than 90 days without review: Multiple Accounts, Unusual Time, Device Mismatch.",
    category: "Rules",
    severity: "warning",
    timestamp: "2026-05-07T09:45:00Z",
    read: false,
    action: { label: "Review Rules", to: "/admin/rules" },
  },
  {
    id: "ANT-003",
    title: "Analyst workload is above normal",
    description:
      "12 analysts currently have more than 20 open investigations. Consider redistributing cases.",
    category: "Users",
    severity: "warning",
    timestamp: "2026-05-07T09:12:00Z",
    read: false,
    action: { label: "View Dashboard", to: "/admin/dashboard" },
  },
  {
    id: "ANT-004",
    title: "Monthly fraud report is ready",
    description: "The April 2026 Fraud Summary report is available for download.",
    category: "Reports",
    severity: "info",
    timestamp: "2026-05-07T08:30:00Z",
    read: false,
    action: { label: "Open Reports", to: "/admin/reports" },
  },
  {
    id: "ANT-005",
    title: "New analyst registered",
    description:
      "James Okafor completed registration and was assigned the Fraud Analyst role.",
    category: "Users",
    severity: "success",
    timestamp: "2026-05-07T08:12:00Z",
    read: true,
    action: null,
  },
  {
    id: "ANT-006",
    title: "Database backup completed",
    description: "Automated backup finished successfully. Snapshot size: 2.4 GB.",
    category: "System",
    severity: "success",
    timestamp: "2026-05-07T06:00:00Z",
    read: true,
    action: null,
  },
  {
    id: "ANT-007",
    title: "High false-positive rate on Multiple Accounts rule",
    description:
      "The Multiple Accounts rule has a 24.2% false-positive rate — above the 15% threshold. Consider deactivating or refining the condition.",
    category: "Rules",
    severity: "warning",
    timestamp: "2026-05-06T17:22:00Z",
    read: true,
    action: { label: "Review Rule", to: "/admin/rules" },
  },
  {
    id: "ANT-008",
    title: "Rule threshold updated",
    description:
      "New Device rule weight increased from 20 to 25 to reduce false positives.",
    category: "Rules",
    severity: "info",
    timestamp: "2026-05-06T15:04:00Z",
    read: true,
    action: null,
  },
  {
    id: "ANT-009",
    title: "Scheduled maintenance completed",
    description:
      "Rule engine restart completed successfully. Total downtime: 45 seconds.",
    category: "System",
    severity: "success",
    timestamp: "2026-05-06T11:00:00Z",
    read: true,
    action: null,
  },
  {
    id: "ANT-010",
    title: "Quarterly compliance report available",
    description:
      "Q1 2026 compliance summary has been generated and is ready for review.",
    category: "Reports",
    severity: "info",
    timestamp: "2026-05-05T16:45:00Z",
    read: true,
    action: { label: "Open Reports", to: "/admin/reports" },
  },
  {
    id: "ANT-011",
    title: "User account suspended",
    description:
      "Rita Adeyemi's account was suspended due to prolonged inactivity.",
    category: "Users",
    severity: "warning",
    timestamp: "2026-05-05T18:12:00Z",
    read: true,
    action: null,
  },
  {
    id: "ANT-012",
    title: "API latency spike detected",
    description:
      "Average API latency rose to 340ms for a 5-minute window. Currently back to normal.",
    category: "System",
    severity: "warning",
    timestamp: "2026-05-04T14:22:00Z",
    read: true,
    action: null,
  },
];

export const ADMIN_NOTIFICATION_CATEGORIES = [
  "All",
  "System",
  "Rules",
  "Reports",
  "Users",
];

export const ADMIN_NOTIFICATION_SEVERITIES = [
  "All",
  "Critical",
  "Warning",
  "Info",
  "Success",
];