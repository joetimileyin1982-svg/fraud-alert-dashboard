import React from "react";

function StatCard({ icon, statTitle, statNumber, color = "#A66CFF" }) {
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
    background: `linear-gradient(135deg, ${hexToRgba(color, 0.32)}, ${hexToRgba(color, 0.1)})`,
    border: `1px solid ${hexToRgba(color, 0.85)}`,
    boxShadow: `
      inset 0 0 20px ${hexToRgba(color, 0.1)},
      0 0 8px ${hexToRgba(color, 0.55)},
      0 0 22px ${hexToRgba(color, 0.3)}
    `,
    padding: "12px 14px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "8px",
  };

  return (
    <div className="statCard" style={cardStyle}>
      <div style={{ color, flexShrink: 0, display: "flex" }}>{icon}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#B8C7DA", fontWeight: 600 }}>
          {statTitle}
        </p>
        <p style={{ margin: 0, fontSize: "19px", color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
          {statNumber}
        </p>
      </div>
    </div>
  );
}

export default StatCard;