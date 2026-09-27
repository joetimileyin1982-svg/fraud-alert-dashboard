import React from "react";

export default function ThreatItem({ title, description, severity, time, icon: Icon, color }) {
  return (
    <div className="threatItem">
      <div
        className="threatIconWrapper"
        style={{
          color: color,
          backgroundColor: `${color}1A`,
          boxShadow: `0 0 12px ${color}33`,
        }}
      >
        <Icon size={18} />
      </div>

      <div className="threatContent">
        <div className="threatTitleRow">
          <span className="threatTitle" style={{ color: color }}>{title}</span>
          <span className={`severityBadge ${severity.toLowerCase()}`}>{severity}</span>
          <span className="threatTime">{time}</span>
        </div>
        <p className="threatDescription">{description}</p>
      </div>
    </div>
  );
}