import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "High Risk", value: 412, percent: "21.2%", color: "#ff007f" },
  { name: "Critical", value: 193, percent: "9.9%", color: "#ff073a" },
  { name: "Warning", value: 1337, percent: "68.9%", color: "#ffea00" },
];

export default function RiskDistributionChart() {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(13,27,42,0.75), rgba(5,11,24,0.9))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(0, 229, 255, 0.25)",
        borderRadius: "18px",
        padding: "20px",
        color: "#fff",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.03) inset,
          0 8px 32px rgba(0,0,0,0.35),
          0 0 24px rgba(0,229,255,0.08)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle glow accent in the corner */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "140px",
          height: "140px",
          background: "radial-gradient(circle, rgba(0,229,255,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", position: "relative", zIndex: 1 }}>
        Risk Distribution
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Donut Chart */}
        <div style={{ width: 140, height: 140, position: "relative", flexShrink: 0 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={48}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((item, i) => (
                  <Cell key={i} fill={item.color} style={{ filter: `drop-shadow(0 0 6px ${item.color}80)` }} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "bold", textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>
              1,942
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Flagged</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
          {data.map((item) => (
            <div
              key={item.name}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8" }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: item.color,
                    boxShadow: `0 0 6px ${item.color}`,
                  }}
                />
                {item.name}
              </span>
              <div>
                <strong style={{ marginRight: "12px" }}>{item.value}</strong>
                <span style={{ color: "#64748b" }}>{item.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}