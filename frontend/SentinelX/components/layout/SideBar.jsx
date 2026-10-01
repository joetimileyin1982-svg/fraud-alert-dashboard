import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Receipt,
  Users,
  Search,
  ShieldAlert,
  Bell,
  FileText,
  History,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./SideBar.css";

const adminNav = [
  { label: "Dashboard",     path: "/admin/dashboard",     icon: LayoutDashboard },
  { label: "Customers",     path: "/admin/customers",     icon: Users },
  { label: "Transactions",  path: "/admin/transactions",  icon: Receipt },
  { label: "Fraud Rules",   path: "/admin/rules",         icon: ShieldAlert },
  { label: "Notifications", path: "/admin/notifications", icon: Bell, badge: 3 },
  { label: "Audit Log",     path: "/admin/audit-log",     icon: History },
];

const analystNav = [
  { label: "Dashboard",       path: "/analyst/dashboard",       icon: LayoutDashboard },
  { label: "Transactions",    path: "/analyst/transactions",    icon: Receipt },
  { label: "Investigation",   path: "/analyst/investigations",  icon: Search },
  { label: "Customers",       path: "/analyst/customers",       icon: Users },
  { label: "Risk Analytics",  path: "/analyst/risk-analytics",  icon: TrendingUp },
  { label: "Notifications",   path: "/analyst/notifications",   icon: Bell, badge: 3 },
  { label: "Reports",         path: "/analyst/reports",         icon: FileText },
];

export default function SideBar() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "Administrator";
  const items = isAdmin ? adminNav : analystNav;

  // For nested routes (e.g. /analyst/investigations/new), highlight the parent
  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path + "/"));

  return (
    <div className="sidebar">
      <div className="sidebarLogo">
        <ShieldCheck size={22} color="#A66CFF" />
        <div>
          <p className="logoTitle">SentinelX</p>
          <p className="logoSub">
            {isAdmin ? "Admin Console" : "Analyst Console"}
          </p>
        </div>
      </div>

      <nav className="sidebarNav">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`navItem ${isActive(item.path) ? "navItemActive" : ""}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.badge && <span className="navBadge">{item.badge}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebarFooter">
        <span className="statusDot" />
        System Online
      </div>
    </div>
  );
}