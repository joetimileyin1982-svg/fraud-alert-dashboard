import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  Users,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  Plus,
  UserPlus,
  FileText,
  ChevronDown,
  Download,
  ChevronRight,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart, Area,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  adminKpis,
  transactionActivity,
  fraudRateTrend,
  analystActivity,
  topRules,
  riskDistribution,
  pendingReviews,
  recentAdminActivity,
  systemAlerts,
} from "../../src/data/admin";
import { customers } from "../../src/data/customers";
import { transactions } from "../../src/data/transactions";
import {
  computeRiskScore,
  riskBucket,
  riskLabel,
} from "../../src/data/FraudRules";
import "./styles/AdminDashboard.css";

const tooltipStyle = {
  background: "rgba(7,20,35,0.95)",
  border: "1px solid #22d3ee",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 12,
  color: "#E8F1FF",
};

function GlowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
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
          <span style={{ color: entry.color }}>
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

function RateTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
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
          <span style={{ color: entry.color }}>
            ● {entry.name || entry.dataKey}
          </span>
          <strong>{entry.value.toFixed(2)}%</strong>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Last 7 Days");

  const topCustomers = useMemo(() => {
    const enriched = customers.map((c) => {
      const theirTxns = transactions.filter((t) => t.customer === c.name);
      const scores = theirTxns.map((t) => computeRiskScore(t.rules));
      const maxScore = scores.length ? Math.max(...scores) : 0;
      return {
        ...c,
        score: maxScore,
        bucket: riskBucket(maxScore),
        label: riskLabel(maxScore),
      };
    });
    return enriched.sort((a, b) => b.score - a.score).slice(0, 5);
  }, []);

  return (
    <div className="adm-page">
      {/* ============ Header ============ */}
      <header className="adm-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage SentinelX operations, users, fraud rules, and system
            activity.
          </p>
        </div>

        <div className="adm-header-actions">
          <div className="adm-period-select">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
            <ChevronDown size={12} className="adm-select-chev" />
          </div>
          <button className="adm-export">
            <Download size={13} /> Export Report
          </button>
          <div className="adm-system-status">
            <span className="adm-status-dot" />
            System Online
          </div>
        </div>
      </header>

      {/* ============ System Overview — 5 KPIs ============ */}
      <section className="adm-kpi-row">
        <KPI
          icon={Receipt}
          label="Transactions Logged"
          value={adminKpis.transactionsLogged.value}
          sub={`+${adminKpis.transactionsLogged.delta}% ${adminKpis.transactionsLogged.sub}`}
          tone="cyan"
          subTone="up"
        />
        <KPI
          icon={Users}
          label="Active Analysts"
          value={adminKpis.activeAnalysts.value}
          sub={adminKpis.activeAnalysts.sub}
          tone="green"
        />
        <KPI
          icon={ShieldCheck}
          label="Active Fraud Rules"
          value={adminKpis.activeRules.value}
          sub={adminKpis.activeRules.sub}
          tone="purple"
        />
        <KPI
          icon={ClipboardList}
          label="Pending Reviews"
          value={adminKpis.pendingReviews.value}
          sub={adminKpis.pendingReviews.sub}
          tone="amber"
        />
        <KPI
          icon={AlertTriangle}
          label="System Alerts"
          value={adminKpis.systemAlerts.value}
          sub={adminKpis.systemAlerts.sub}
          tone="red"
        />
      </section>

      {/* ============ Quick Actions ============ */}
      <section className="adm-quick-actions">
        <span className="adm-qa-label">Quick Actions</span>
        <div className="adm-qa-buttons">
          <button
            className="adm-qa-btn"
            onClick={() => navigate("/admin/transactions")}
          >
            <Plus size={13} /> Log Transaction
          </button>
          <button
            className="adm-qa-btn"
            onClick={() => navigate("/admin/customers")}
          >
            <UserPlus size={13} /> Add Customer
          </button>
          <button
            className="adm-qa-btn"
            onClick={() => navigate("/admin/rules")}
          >
            <ShieldCheck size={13} /> Create Fraud Rule
          </button>
          <button
            className="adm-qa-btn"
            onClick={() => navigate("/admin/audit-log")}
          >
            <FileText size={13} /> View Audit Log
          </button>
        </div>
      </section>

      {/* ============ Transaction Activity ============ */}
      <section className="adm-card">
        <div className="adm-card-head">
          <div>
            <h3>Transaction Activity</h3>
            <span className="adm-card-sub">
              System throughput over the last 7 days
            </span>
          </div>
          <div className="adm-legend">
            <span><i style={{ background: "#22d3ee" }} />Logged</span>
            <span><i style={{ background: "#34d399" }} />Approved</span>
            <span><i style={{ background: "#fbbf24" }} />Flagged</span>
            <span><i style={{ background: "#a855f7" }} />Reviewed</span>
          </div>
        </div>

        <div className="adm-chart">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={transactionActivity}>
              <defs>
                {[
                  ["gLogged", "#22d3ee"],
                  ["gApproved", "#34d399"],
                  ["gFlagged", "#fbbf24"],
                  ["gReviewed", "#a855f7"],
                ].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.30} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#17324D" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                axisLine={false}
                tickLine={false}
                fontSize={11}
                dy={6}
              />
              <YAxis
                stroke="#64748b"
                axisLine={false}
                tickLine={false}
                fontSize={11}
                tickFormatter={(v) => `${v / 1000}K`}
              />
              <Tooltip
                content={<GlowTooltip />}
                cursor={{ stroke: "#22d3ee", strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="logged"
                stroke="#22d3ee"
                fill="url(#gLogged)"
                strokeWidth={2}
                name="Logged"
              />
              <Area
                type="monotone"
                dataKey="approved"
                stroke="#34d399"
                fill="url(#gApproved)"
                strokeWidth={1.5}
                name="Approved"
              />
              <Area
                type="monotone"
                dataKey="flagged"
                stroke="#fbbf24"
                fill="url(#gFlagged)"
                strokeWidth={1.5}
                name="Flagged"
              />
              <Area
                type="monotone"
                dataKey="reviewed"
                stroke="#a855f7"
                fill="url(#gReviewed)"
                strokeWidth={1.5}
                name="Reviewed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ============ Fraud Rate Trend + Top Customers ============ */}
      <section className="adm-row-2">
        <div className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3>Fraud Rate Trend</h3>
              <span className="adm-card-sub">
                Percentage of transactions flagged, last 30 days
              </span>
            </div>
            <div className="adm-rate-summary">
              <TrendingUp size={13} />
              <span className="mono">
                {fraudRateTrend[fraudRateTrend.length - 1].rate.toFixed(2)}%
              </span>
              <span className="adm-rate-delta">today</span>
            </div>
          </div>

          <div className="adm-chart">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={fraudRateTrend}>
                <CartesianGrid stroke="#17324D" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  interval={4}
                />
                <YAxis
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  content={<RateTooltip />}
                  cursor={{ stroke: "#ff007f", strokeDasharray: "4 4" }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#ff007f"
                  strokeWidth={2}
                  dot={false}
                  name="Fraud rate"
                  activeDot={{ r: 4, fill: "#ff007f" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3>Top Customers by Risk</h3>
              <span className="adm-card-sub">
                Highest risk scores across the customer base
              </span>
            </div>
            <button
              className="adm-link"
              onClick={() => navigate("/admin/customers")}
            >
              View all <ChevronRight size={12} />
            </button>
          </div>

          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th className="num">Score</th>
                <th>Level</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c) => (
                <tr key={c.id} className="adm-clickable-row">
                  <td>
                    <div className="adm-cust-cell">
                      <div className="adm-cust-name">{c.name}</div>
                      <div className="adm-cust-id mono">{c.id}</div>
                    </div>
                  </td>
                  <td className="num">
                    <span className={`adm-score mono ${c.bucket}`}>
                      {c.score}
                    </span>
                  </td>
                  <td>
                    <span className={`adm-badge ${c.bucket}`}>{c.label}</span>
                  </td>
                  <td className="adm-row-action">
                    <button
                      className="adm-view-btn"
                      onClick={() =>
                        navigate(
                          `/admin/customers?search=${encodeURIComponent(c.name)}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ Operations: Analyst Activity + Rule Performance ============ */}
      <section className="adm-row-2">
        <div className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3>Analyst Activity</h3>
              <span className="adm-card-sub">Active Analysts: 21 / 24</span>
            </div>
            <button className="adm-link">View all</button>
          </div>

          <table className="adm-table">
            <thead>
              <tr>
                <th>Analyst</th>
                <th className="num">Investigations</th>
                <th className="num">Reviewed</th>
                <th className="num">Escalated</th>
              </tr>
            </thead>
            <tbody>
              {analystActivity.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td className="num mono">{a.investigations}</td>
                  <td className="num mono">{a.reviewed}</td>
                  <td className="num mono">{a.escalated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3>Top Fraud Rules</h3>
              <span className="adm-card-sub">Most triggered this period</span>
            </div>
            <button
              className="adm-link"
              onClick={() => navigate("/admin/rules")}
            >
              View Rules <ChevronRight size={12} />
            </button>
          </div>

          <table className="adm-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th className="num">Triggered</th>
                <th className="num">Critical</th>
              </tr>
            </thead>
            <tbody>
              {topRules.map((r) => (
                <tr key={r.rule}>
                  <td>
                    <div className="adm-rule-cell">
                      <span
                        className={`adm-rule-dot ${
                          r.active ? "active" : "inactive"
                        }`}
                      />
                      <span>{r.rule}</span>
                    </div>
                  </td>
                  <td className="num mono">{r.triggered}</td>
                  <td className="num mono">{r.critical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ Risk Overview + Pending Reviews ============ */}
      <section className="adm-row-2">
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Risk Distribution</h3>
          </div>

          <div className="adm-risk">
            <div className="adm-risk-chart">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    dataKey="value"
                    innerRadius={58}
                    outerRadius={86}
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
              <div className="adm-risk-center">
                <div className="adm-risk-value mono">72%</div>
                <div className="adm-risk-label">Safe</div>
              </div>
            </div>

            <ul className="adm-risk-legend">
              {riskDistribution.map((d) => (
                <li key={d.name}>
                  <span className="dot" style={{ background: d.color }} />
                  <span>{d.name}</span>
                  <strong className="mono">{d.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Pending Reviews</h3>
            <button
              className="adm-link"
              onClick={() => navigate("/admin/transactions")}
            >
              View Transactions <ChevronRight size={12} />
            </button>
          </div>

          <ul className="adm-pending">
            <li>
              <span className="adm-pending-label">
                <span className="dot critical" /> Critical
              </span>
              <span className="adm-pending-value mono">
                {pendingReviews.critical}
              </span>
            </li>
            <li>
              <span className="adm-pending-label">
                <span className="dot high" /> High Risk
              </span>
              <span className="adm-pending-value mono">
                {pendingReviews.highRisk}
              </span>
            </li>
            <li>
              <span className="adm-pending-label">
                <span className="dot review" /> Suspicious
              </span>
              <span className="adm-pending-value mono">
                {pendingReviews.suspicious}
              </span>
            </li>
            <li className="adm-pending-total">
              <span>Total</span>
              <span className="mono">{pendingReviews.total}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ Recent Admin Activity (full-width) ============ */}
      <section>
        <div className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3>Recent Admin Activity</h3>
              <span className="adm-card-sub">
                Latest administrative actions
              </span>
            </div>
            <button
              className="adm-link"
              onClick={() => navigate("/admin/audit-log")}
            >
              View Audit Log <ChevronRight size={12} />
            </button>
          </div>

          <ul className="adm-activity">
            {recentAdminActivity.map((a) => (
              <li key={a.id} className={`adm-activity-item ${a.tone}`}>
                <div className="adm-activity-icon">
                  <Activity size={12} />
                </div>
                <div className="adm-activity-body">
                  <div className="adm-activity-text">{a.text}</div>
                  <div className="adm-activity-time">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ System Alerts ============ */}
      <section className="adm-card">
        <div className="adm-card-head">
          <h3>System Alerts</h3>
        </div>

        <ul className="adm-alerts">
          {systemAlerts.map((a) => (
            <li key={a.id} className={`adm-alert ${a.tone}`}>
              <span className="adm-alert-dot" />
              <span className="adm-alert-text">{a.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ============ KPI ============ */
function KPI({ icon: Icon, label, value, sub, tone, subTone }) {
  return (
    <div className={`adm-kpi ${tone}`}>
      <div className="adm-kpi-icon">
        <Icon size={18} />
      </div>
      <div className="adm-kpi-body">
        <div className="adm-kpi-label">{label}</div>
        <div className="adm-kpi-value mono">{value.toLocaleString()}</div>
        {sub && (
          <div className={`adm-kpi-sub ${subTone || ""}`}>{sub}</div>
        )}
      </div>
    </div>
  );
}