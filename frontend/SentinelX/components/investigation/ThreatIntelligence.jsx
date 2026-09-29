import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Filter,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ThreatItem from "./ThreatItem";
import ThreatDrawer from "./ThreatDrawer";
import { alertsData } from "../../src/data/AlertsData";
import "./ThreatIntelligence.css";

export default function ThreatIntelligence() {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [activeTab, setActiveTab] = useState("All Alerts");
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  const tabsRef = useRef(null);

  const newAlertsCount = alertsData.filter(
    (a) => a.status === "New" || a.isNew
  ).length;

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -80 : 80;
      tabsRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredAlerts = useMemo(() => {
    const filtered = alertsData.filter((alert) => {
      if (
        activeTab === "New" &&
        alert.status !== "New" &&
        !alert.isNew
      )
        return false;
      if (activeTab === "In Review" && alert.status !== "In Review")
        return false;
      if (activeTab === "Resolved" && alert.status !== "Resolved")
        return false;

      if (selectedType !== "All" && alert.type !== selectedType)
        return false;

      return true;
    });

    if (sortOrder === "Severity") {
      const order = { Critical: 0, High: 1, Warning: 2 };
      return [...filtered].sort(
        (a, b) => (order[a.severity] ?? 99) - (order[b.severity] ?? 99)
      );
    }

    return filtered;
  }, [activeTab, selectedType, sortOrder]);

  return (
    <aside className="threatIntelligence">
      {/* Header */}
      <div className="threatHeader">
        <div className="threatHeaderTitle">
          <ShieldAlert className="shieldIcon" size={16} />
          <div>
            <h3 className="threatMainTitle">Threat Intelligence</h3>
            <span className="threatSubtitle">
              Real-time fraud alerts & intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="threatTabsContainer">
        <button
          className="tabScrollBtn"
          onClick={() => scrollTabs("left")}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={13} />
        </button>

        <div className="threatTabs" ref={tabsRef}>
          <button
            className={`tabBtn ${
              activeTab === "All Alerts" ? "active" : ""
            }`}
            onClick={() => setActiveTab("All Alerts")}
          >
            All Alerts <span className="tabCount">{alertsData.length}</span>
          </button>
          <button
            className={`tabBtn ${activeTab === "New" ? "active" : ""}`}
            onClick={() => setActiveTab("New")}
          >
            New{" "}
            {newAlertsCount > 0 && (
              <span className="tabCount highlight">{newAlertsCount}</span>
            )}
          </button>
          <button
            className={`tabBtn ${
              activeTab === "In Review" ? "active" : ""
            }`}
            onClick={() => setActiveTab("In Review")}
          >
            In Review
          </button>
          <button
            className={`tabBtn ${
              activeTab === "Resolved" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Resolved")}
          >
            Resolved
          </button>
        </div>

        <button
          className="tabScrollBtn"
          onClick={() => scrollTabs("right")}
          aria-label="Scroll Right"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Controls */}
      <div className="threatControls">
        <button className="filterBtn">
          <Filter size={10} /> Filter
        </button>

        <select
          className="controlSelect"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Transaction">Transactions</option>
          <option value="Behavior">Behavior</option>
          <option value="Device">Devices</option>
        </select>

        <select
          className="controlSelect"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="Newest">Sort: Newest</option>
          <option value="Severity">Sort: Severity</option>
        </select>
      </div>

      {/* List */}
      <div className="threatPanel">
        <div className="threatList">
          {filteredAlerts.length === 0 ? (
            <div className="emptyFeed">No alerts match criteria.</div>
          ) : (
            filteredAlerts.map((threat) => (
              <div
                key={threat.id}
                className="threatLink"
                onClick={() => setSelectedThreat(threat)}
              >
                <ThreatItem {...threat} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="threatFooter">
        <Link to="/analyst/investigation" className="viewAllBtn">
          <span>View All Alerts</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <ThreatDrawer
        threat={selectedThreat}
        onClose={() => setSelectedThreat(null)}
      />
    </aside>
  );
}