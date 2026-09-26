import React from "react";
import { LayoutDashboard, Receipt, Search, ShieldAlert, Bell, FileText } from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Receipt, label: "Transactions" },
  { icon: Search, label: "Investigation" },
  { icon: ShieldAlert, label: "Risk Analytics" },
  { icon: Bell, label: "Notifications", badge: 3 },
  { icon: FileText, label: "Reports" },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarLogo">
        <ShieldAlert size={22} color="#00e5ff" />
        <div>
          <p className="logoTitle">Fraud Alert</p>
          <p className="logoSub">Dashboard</p>
        </div>
      </div>

      <nav className="sidebarNav">
        {navItems.map((item) => (
          <div key={item.label} className={`navItem ${item.active ? "navItemActive" : ""}`}>
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.badge && <span className="navBadge">{item.badge}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebarFooter">
        <span className="statusDot" />
        System Online
      </div>
    </div>
  );
}