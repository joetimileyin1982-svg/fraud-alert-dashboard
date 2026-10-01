import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Receipt,
  Users,
  ShieldAlert,
  Bell,
  FileText,
  History,
} from "lucide-react";
import "./SideBar.css";

const currentUser = { role: "admin" };

const adminNav = [
  { label: "Dashboard",    path: "/admin/dashboard",    icon: LayoutDashboard },
  { label: "Transactions", path: "/admin/transactions", icon: Receipt },
  { label: "Users",        path: "/admin/users",        icon: Users },
  { label: "Fraud Rules",  path: "/admin/rules",        icon: ShieldAlert },
  { label: "Reports",      path: "/admin/reports",      icon: FileText },
  { label: "Notifications",path: "/admin/notifications",icon: Bell, badge: 3 },
  { label: "Audit Log",    path: "/admin/audit-log",    icon: History },
];

export default function SideBar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebarLogo">
        <ShieldCheck size={22} color="#A66CFF" />
        <div>
          <p className="logoTitle">SentinelX</p>
          <p className="logoSub">Admin Console</p>
        </div>
      </div>

      <nav className="sidebarNav">
        {adminNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`navItem ${
              location.pathname === item.path ? "navItemActive" : ""
            }`}
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