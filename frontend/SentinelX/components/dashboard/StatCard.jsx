import React from "react";

function StatCard({ icon, statTitle, statNumber, color = "#A66CFF" }) {
  const titleStyle = {
    fontSize: "15px",
    padding: "10px",
  };

  const numberStyle = {
    fontSize: "20px",
    padding: "10px",
  };

  // Convert Hex (e.g. "#FF1744" or "#F00") to RGBA for consistent glowing effects
  const hexToRgba = (hex, alpha) => {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cardStyle = {
    background: `linear-gradient(
      135deg,
      ${hexToRgba(color, 0.32)},
      ${hexToRgba(color, 0.1)}
    )`,
    border: `1px solid ${hexToRgba(color, 0.85)}`,
    boxShadow: `
      inset 0 0 20px ${hexToRgba(color, 0.1)},
      0 0 8px ${hexToRgba(color, 0.55)},
      0 0 22px ${hexToRgba(color, 0.3)},
      0 0 45px ${hexToRgba(color, 0.12)}
    `,
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  };

  return (
    <div className="statCard" style={cardStyle}>
      <div className="statIconWrap" style={{ color: color, flexShrink: 0 }}>
        {icon}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <p className="statTitle" style={titleStyle}>
          {statTitle}
        </p>
        <p className="statNumber" style={numberStyle}>
          {statNumber}
        </p>
      </div>
    </div>
  );
}

export default StatCard;