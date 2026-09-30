import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import "./TopBar.css";

const user = {
  name: "Temitope A.",
  role: "Fraud Analyst",
  initials: "TA",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="topBar">
      {/* Row 1: search + actions */}
      <div className="topBarRow">
        <GlobalSearch />

        <div className="topBarActions">
          <button className="bellWrap" aria-label="Notifications">
            <Bell size={18} />
            <span className="bellDot" />
          </button>

          <div
            className="profileSec"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="avatarWrap">
              <div className="avatar">{user.initials}</div>
              <span className="statusRing" />
            </div>
            <div className="profileText">
              <p className="profileName">{user.name}</p>
              <p className="profileRole">{user.role}</p>
            </div>
            <ChevronDown
              size={14}
              className={`profileChevron ${menuOpen ? "open" : ""}`}
            />

            {menuOpen && (
              <div className="profileMenu">
                <div className="menuItem">
                  <User size={14} /> Profile
                </div>
                <div className="menuItem">
                  <Settings size={14} /> Settings
                </div>
                <div className="menuDivider" />
                <div className="menuItem menuItemDanger">
                  <LogOut size={14} /> Log out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: greeting */}
      <div className="greeting">
        <h2 className="greetingTitle">
          {getGreeting()},{" "}
          <span className="greetingName">{user.name.split(" ")[0]}</span>
        </h2>
        <p className="greetingSub">
          Here's what's happening with fraud and risk today.
        </p>
      </div>
    </div>
  );
}