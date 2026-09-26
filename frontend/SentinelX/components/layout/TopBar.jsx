import React, { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import SearchBar from "../../components/transactions/SearchBar";
import "./TopBar.css";

const user = {
  name: "Daisy H.",
  role: "Fraud Analyst",
  initials: "DH",
};

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="topBar">
      <div className="topBarRow">
        <SearchBar />

        <div className="bellWrap">
          <Bell size={18} color="#E8F1FF" />
          <span className="bellDot" />
        </div>

        <div className="profileSec" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="avatarWrap">
            <div className="avatar">{user.initials}</div>
            <span className="statusRing" />
          </div>
          <div>
            <p className="profileName">{user.name}</p>
            <p className="profileRole">{user.role}</p>
          </div>
          <ChevronDown size={14} color="#7EA0C4" />

          {menuOpen && (
            <div className="profileMenu">
              <div className="menuItem">Profile</div>
              <div className="menuItem">Settings</div>
              <div className="menuItem menuItemDanger">Log out</div>
            </div>
          )}
        </div>
      </div>

      <div className="greeting">
        <h2>
          Good morning, <span className="greetingName">{user.name}</span>
        </h2>
        <p className="greetingSub">Monitor, investigate and stop fraud in real time.</p>
      </div>
    </div>
  );
}