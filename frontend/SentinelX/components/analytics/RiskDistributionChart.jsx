import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "High Risk", value: 412, percent: "21.2%", color: "#ff007f" },
  { name: "Critical", value: 193, percent: "9.9%", color: "#ff073a" },
  { name: "Warning", value: 1337, percent: "68.9%", color: "#ffea00" },
];

export default function RiskDistributionChart() {
  return (
    <div style={{ background: "#050b18", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px", color: "#fff" }}>
      <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Risk Distribution</h3>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        {/* Donut Chart */}
        <div style={{ width: 140, height: 140, position: "relative", flexShrink: 0 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} innerRadius={48} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                {data.map((item, i) => (
                  <Cell key={i} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>1,942</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Flagged</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
          {data.map((item) => (
            <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
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