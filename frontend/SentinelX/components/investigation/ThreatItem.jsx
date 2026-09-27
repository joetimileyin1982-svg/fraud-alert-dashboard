import React from "react";

export default function ThreatItem({ title, description, severity, time, color }) {
  return (
    <div className="threatItem">
      <div className="threatTopRow">
        <span className="threatTitle" style={{ color }}>{title}</span>
        <span className={`severityBadge ${severity.toLowerCase()}`}>{severity}</span>
      </div>
      <div className="threatMetaRow">
        <span className="threatTime">{time}</span>
      </div>
      <p className="threatDescription">{description}</p>
    </div>
  );
}