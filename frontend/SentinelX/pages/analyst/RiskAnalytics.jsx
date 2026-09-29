import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Shield,
  AlertTriangle,
  Activity,
  DollarSign,
  Zap,
  Smartphone,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  kpis,
  riskTrend,
  riskDistribution,
  topRules,
  riskByType,
  highRiskCustomers,
  deviceRisk,
  deviceTrend,
  fraudByMerchant,
  timeOfDayActivity,
  emergingSignals,
} from "../../src/data/analytics";
import "../../styles/RiskAnalytics.css";

/* ============================================================
   Reusable bits
   ============================================================ */

const tooltipBox = {
  background: "rgba(7,20,35,0.92)",
  border: "1px solid #22d3ee",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 12,
  color: "#E8F1FF",
};

function GlowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipBox}>
      <p style={{ margin: "0 0 6px", color: "#22d3ee", fontWeight: 600 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 4,
          }}
        >
          <span style={{ color: entry.color || entry.fill }}>
            ● {entry.name || entry.dataKey}
          </span>
          <strong>
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

function KPI({ icon: Icon, label, value, delta, sub, tone }) {
  const positive = delta >= 0;
  return (
    <div className={`ra-kpi ${tone || ""}`}>
      <div className="ra-kpi-icon">
        <Icon size={18} />
      </div>
      <div className="ra-kpi-body">
        <div className="ra-kpi-label">{label}</div>
        <div className="ra-kpi-value mono">{value}</div>
        {typeof delta === "number" && (
          <div className={`ra-kpi-delta ${positive ? "up" : "down"}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta)}%
            <span className="ra-kpi-delta-label">
              {sub || "vs previous period"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, action, children, className }) {
  return (
    <section className={`ra-card ${className || ""}`}>
      {title && (
        <header className="ra-card-head">
          <h3>{title}</h3>
          {action && <span className="ra-card-action">{action}</span>}
        </header>
      )}
      {children}
    </section>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function RiskAnalytics() {
  const navigate = useNavigate();

  return (
    <div className="ra-page">
      {/* Header */}
      <header className="ra-header">
        <div>
          <h1>Risk Analytics</h1>
          <p>Analyze fraud patterns, risk trends and emerging threats.</p>
        </div>
        <div className="ra-header-actions">
          <select className="ra-select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
          <label className="ra-checkbox">
            <input type="checkbox" /> Compare with previous period
          </label>
          <button className="ra-btn">Export Report</button>
        </div>
      </header>

      {/* Layout grid */}
      <div className="ra-layout">
        {/* ============ Left column ============ */}
        <div className="ra-col-main">
          {/* KPI row */}
          <div className="ra-kpi-row">
            <KPI
              icon={Shield}
              label="Fraud Rate"
              value={`${kpis.fraudRate.value}%`}
              delta={kpis.fraudRate.delta}
              tone="purple"
            />
            <KPI
              icon={AlertTriangle}
              label="High-Risk Rate"
              value={`${kpis.highRiskRate.value}%`}
              delta={kpis.highRiskRate.delta}
              sub={kpis.highRiskRate.sub}
              tone="green"
            />
            <KPI
              icon={Activity}
              label="Avg. Risk Score"
              value={kpis.avgRiskScore.value}
              delta={kpis.avgRiskScore.delta}
              tone="amber"
            />
            <KPI
              icon={DollarSign}
              label="Fraud Exposure"
              value={kpis.fraudExposure.value}
              delta={kpis.fraudExposure.delta}
              tone="critical"
            />
          </div>

          {/* Trend + distribution */}
          <div className="ra-row-2">
            <Card
              title="Transaction Risk Trend"
              action={
                <div className="ra-legend-inline">
                  <span><i style={{ background: "#34d399" }} />Safe</span>
                  <span><i style={{ background: "#fbbf24" }} />Suspicious</span>
                  <span><i style={{ background: "#f472b6" }} />High Risk</span>
                  <span><i style={{ background: "#ef4444" }} />Critical</span>
                </div>
              }
            >
              <div className="ra-chart">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={riskTrend}>
                    <defs>
                      {[
                        ["gSafe", "#34d399"],
                        ["gSusp", "#fbbf24"],
                        ["gHigh", "#f472b6"],
                        ["gCrit", "#ef4444"],
                      ].map(([id, c]) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={c} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={c} stopOpacity={0}    />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid stroke="#17324D" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" axisLine={false} tickLine={false} fontSize={11} dy={6} />
                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={11}
                           tickFormatter={(v) => `${v / 1000}K`}
                           domain={[0, 10000]} ticks={[0, 2000, 4000, 6000, 8000, 10000]} />
                    <Tooltip content={<GlowTooltip />} cursor={{ stroke: "#22d3ee", strokeDasharray: "4 4" }} />
                    <Area type="monotone" dataKey="Safe"       stroke="#34d399" fill="url(#gSafe)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Suspicious" stroke="#fbbf24" fill="url(#gSusp)" strokeWidth={2} />
                    <Area type="monotone" dataKey="HighRisk"   stroke="#f472b6" fill="url(#gHigh)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Critical"   stroke="#ef4444" fill="url(#gCrit)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Risk Distribution">
              <div className="ra-dist">
                <div className="ra-dist-chart">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        dataKey="value"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        stroke="#0D1B31"
                        strokeWidth={2}
                      >
                        {riskDistribution.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<GlowTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="ra-dist-center">
                    <div className="ra-dist-total mono">12,000</div>
                    <div className="ra-dist-label">Transactions</div>
                  </div>
                </div>
                <ul className="ra-dist-legend">
                  {riskDistribution.map((d) => (
                    <li key={d.name}>
                      <span className="dot" style={{ background: d.color }} />
                      <span>{d.name}</span>
                      <strong className="mono">{d.value}%</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Rules + Type + Location-row */}
          <div className="ra-row-3">
            <Card title="Top Triggered Fraud Rules" action="View All">
              <table className="ra-table">
                <thead>
                  <tr>
                    <th>Rule</th>
                    <th className="num">Triggers</th>
                    <th className="num">Critical</th>
                  </tr>
                </thead>
                <tbody>
                  {topRules.map((r) => (
                    <tr key={r.rule}>
                      <td>{r.rule}</td>
                      <td className="num mono">{r.triggers}</td>
                      <td className="num">
                        <span className="ra-pill critical mono">{r.critical}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card title="Risk by Transaction Type">
              <table className="ra-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th className="num">Transactions</th>
                    <th className="num">High Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {riskByType.map((r) => (
                    <tr key={r.type}>
                      <td>{r.type}</td>
                      <td className="num mono">{r.transactions.toLocaleString()}</td>
                      <td className="num">
                        <span className="ra-pill amber mono">{r.highRisk}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* High-risk customers + device risk + merchant + time */}
          <div className="ra-row-2">
            <Card title="High-Risk Customers" action="View All">
              <table className="ra-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th className="num">Risk</th>
                    <th className="num">Txns</th>
                    <th className="num">Signals</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {highRiskCustomers.map((c) => (
                    <tr
                      key={c.id}
                      className="ra-clickable"
                      onClick={() =>
                        navigate(
                          `/analyst/customers?search=${encodeURIComponent(c.name)}`
                        )
                      }
                    >
                      <td>
                        <div className="ra-cust">
                          <div className="ra-cust-avatar">
                            {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="ra-cust-name">{c.name}</div>
                            <div className="ra-cust-id mono">{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="num">
                        <span className="ra-pill critical mono">{c.score}</span>
                      </td>
                      <td className="num mono">{c.txns}</td>
                      <td className="num mono">{c.signals}</td>
                      <td className="ra-cust-action">
                        <button className="ra-view-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card title="Device Risk" action="View All">
              <div className="ra-device-cards">
                <div className="ra-device-card trusted">
                  <div className="ra-device-label">
                    <span className="dot" /> Trusted Devices
                  </div>
                  <div className="ra-device-value mono">
                    {deviceRisk.trusted.toLocaleString()}
                  </div>
                </div>
                <div className="ra-device-card new">
                  <div className="ra-device-label">
                    <span className="dot" /> New Devices
                  </div>
                  <div className="ra-device-value mono">
                    {deviceRisk.new.toLocaleString()}
                  </div>
                </div>
                <div className="ra-device-card suspicious">
                  <div className="ra-device-label">
                    <span className="dot" /> Suspicious Devices
                  </div>
                  <div className="ra-device-value mono">
                    {deviceRisk.suspicious.toLocaleString()}
                  </div>
                </div>
                <div className="ra-device-card high">
                  <div className="ra-device-label">
                    <span className="dot" /> High-Risk Devices
                  </div>
                  <div className="ra-device-value mono">
                    {deviceRisk.highRisk.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="ra-device-chart">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={deviceTrend}>
                    <CartesianGrid stroke="#17324D" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} />
                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} />
                    <Tooltip content={<GlowTooltip />} cursor={{ fill: "rgba(34,211,238,0.06)" }} />
                    <Bar dataKey="NewDevices" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="ra-row-2">
            <Card title="Fraud by Merchant" action="View All">
              <table className="ra-table">
                <thead>
                  <tr>
                    <th>Merchant</th>
                    <th className="num">Fraud Value</th>
                    <th className="num">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {fraudByMerchant.map((m, i) => (
                    <tr key={m.merchant}>
                      <td>
                        <div className="ra-merchant">
                          <div className="ra-merchant-avatar">
                            {m.merchant[0]}
                          </div>
                          <span>{m.merchant}</span>
                        </div>
                      </td>
                      <td className="num mono">{m.value}</td>
                      <td className="num mono">{m.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card title="Time-of-Day Activity">
              <div className="ra-chart">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={timeOfDayActivity}>
                    <CartesianGrid stroke="#17324D" vertical={false} />
                    <XAxis dataKey="hour" stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} />
                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={10} />
                    <Tooltip content={<GlowTooltip />} cursor={{ fill: "rgba(34,211,238,0.06)" }} />
                    <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* ============ Right column — Emerging signals ============ */}
        <aside className="ra-col-side">
          <Card
            title="Emerging Risk Signals"
            action="View All"
            className="ra-signals"
          >
            <ul className="ra-signal-list">
              {emergingSignals.map((s) => (
                <li key={s.id} className={`ra-signal ${s.tone}`}>
                  <div className="ra-signal-icon">
                    {s.tone === "low" ? (
                      <Shield size={14} />
                    ) : (
                      <Zap size={14} />
                    )}
                  </div>
                  <div className="ra-signal-body">
                    <div className="ra-signal-title">{s.title}</div>
                    <div className="ra-signal-sub">{s.sub}</div>
                    <div className="ra-signal-time">{s.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}