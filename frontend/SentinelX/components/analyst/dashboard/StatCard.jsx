import React from "react";
import "./StatCard.css";

function StatCard({ icon, statTitle, statNumber, color = "#A66CFF" }) {
  const hexToRgba = (hex, alpha) => {
    const clean = hex.replace("#", "");
    const full =
      clean.length === 3
        ? clean.split("").map((c) => c + c).join("")
        : clean;

    const r = parseInt(full.substring(0, 2), 16);
    const g = parseInt(full.substring(2, 4), 16);
    const b = parseInt(full.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const styles = {
    "--accent": color,
    "--accent-light": hexToRgba(color, 0.18),
    "--accent-border": hexToRgba(color, 0.75),
    "--accent-glow": hexToRgba(color, 0.22),
  };

  return (
    <div className="statCard" style={styles}>
      <div className="statCardTop">
        <div className="iconWrapper">{icon}</div>
      </div>

      <div className="statCardContent">
        <p className="statTitle">{statTitle}</p>
        <h2 className="statNumber">{statNumber.toLocaleString()}</h2>
      </div>
    </div>
  );
}

export default StatCard;