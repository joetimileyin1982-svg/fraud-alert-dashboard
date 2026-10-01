import React from "react";
import "./ThreatIntelligence.css";

export default function ThreatItem({
  title,
  subtitle,
  description,
  severity,
  status,
  isNew,
  time,
  icon: Icon,
  color,
}) {
  const getBadgeText = () => {
    if (status === "In Review") return "In Review";
    if (status === "Resolved") return "Resolved";
    return severity;
  };

  const getBadgeClass = () => {
    if (status === "In Review") return "in-review";
    if (status === "Resolved") return "resolved";
    return severity?.toLowerCase();
  };

  return (
    <div className="threatItemCard">
      <div
        className="iconWrapper"
        style={{ color, backgroundColor: `${color}1A` }}
      >
        {Icon && <Icon size={14} />}
      </div>

      <div className="threatContent">
        {/* Title row: title + NEW badge */}
        <div className="threatTitleRow">
          <span className="threatTitle">{title}</span>
          {(isNew || status === "New") && (
            <span className="newBadge">NEW</span>
          )}
        </div>

        {/* Subtitle: full width */}
        <div className="threatSubtitle">{subtitle || description}</div>

        {/* Footer row: time on left, badge on right */}
        <div className="threatFooterRow">
          <span className="threatTime">{time}</span>
          <span className={`severityBadge ${getBadgeClass()}`}>
            {getBadgeText()}
          </span>
        </div>
      </div>
    </div>
  );
}