import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Receipt,
  Search,
  ShieldAlert,
  Bell,
  FileText,
} from "lucide-react";
import "./SideBar.css";

const currentUser = { role: "analyst" }; // temporary, until real auth exists

const analystNav = [
  { label: "Dashboard", path: "/analyst/dashboard", icon: LayoutDashboard },
  { label: "Transactions", path: "/analyst/transactions", icon: Receipt },
  { label: "Investigation", path: "/analyst/investigation", icon: Search },
  { label: "Risk Analytics", path: "/analyst/risk-analytics", icon: ShieldAlert },
  { label: "Notifications", path: "/analyst/notifications", icon: Bell, badge: 3 },
  { label: "Reports", path: "/analyst/reports", icon: FileText },
];

const adminNav = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Receipt },
  { label: "Reports", path: "/admin/reports", icon: FileText },
  { label: "Settings", path: "/admin/settings", icon: ShieldAlert },
];

export default function SideBar() {
  const location = useLocation();
  const navItems = currentUser.role === "admin" ? adminNav : analystNav;

  return (
    <div className="sidebar">
      <div className="sidebarLogo">
        <ShieldCheck size={22} color="#A66CFF" />
        <div>
          <p className="logoTitle">Fraud Alert</p>
          <p className="logoSub">Dashboard</p>
        </div>
      </div>

      <nav className="sidebarNav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`navItem ${location.pathname === item.path ? "navItemActive" : ""}`}
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