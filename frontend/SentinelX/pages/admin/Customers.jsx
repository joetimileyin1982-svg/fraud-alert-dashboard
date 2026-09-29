// src/pages/analyst/Customers.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ShieldAlert,
  Smartphone,
  MapPin,
  Clock,
  ArrowUpRight,
  ChevronRight,
  UserX,
} from "lucide-react";
import { customers } from "../../data/customers";
import "./Customers.css";

const RISK_FILTERS = ["All", "Safe", "Suspicious", "High Risk", "Critical"];
const STATUS_FILTERS = ["All", "Active", "Suspended"];

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const formatRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

// Convert "High Risk" → "high-risk" for CSS class suffixes
const riskSlug = (level) => level.toLowerCase().replace(/\s+/g, "-");

export default function Customers() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      const matchesRisk = riskFilter === "All" || c.riskLevel === riskFilter;
      const matchesStatus =
        statusFilter === "All" || c.accountStatus === statusFilter;
      return matchesQuery && matchesRisk && matchesStatus;
    });
  }, [query, riskFilter, statusFilter]);

  const handleOpenInvestigation = (c) => {
    // Wire this to your investigation route
    navigate(`/analyst/investigations/new?customer=${c.id}`);
  };

  return (
    <div className="customers-page">
      {/* ---------- Header ---------- */}
      <header className="cx-header">
        <div>
          <h1 className="cx-title">Customers</h1>
          <p className="cx-subtitle">
            {filtered.length} of {customers.length} customers
          </p>
        </div>
      </header>

      {/* ---------- Toolbar ---------- */}
      <div className="cx-toolbar">
        <div className="cx-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search name, customer ID, email, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="cx-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="cx-filters">
          <SlidersHorizontal size={14} className="cx-filter-icon" />
          <span className="cx-filter-label">Risk:</span>
          {RISK_FILTERS.map((f) => (
            <button
              key={f}
              className={`cx-chip ${riskFilter === f ? "cx-chip--active" : ""}`}
              onClick={() => setRiskFilter(f)}
            >
              {f}
            </button>
          ))}
          <span className="cx-filter-sep" />
          <span className="cx-filter-label">Status:</span>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`cx-chip ${statusFilter === f ? "cx-chip--active" : ""}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <div className="cx-table-wrapper">
        <table className="cx-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Risk Level</th>
              <th className="cx-num">Risk Score</th>
              <th className="cx-num">Transactions</th>
              <th className="cx-num">Total Value</th>
              <th>Last Activity</th>
              <th>Status</th>
              <th aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="cx-row"
                onClick={() => setSelected(c)}
              >
                <td>
                  <div className="cx-cust-cell">
                    <div className="cx-avatar">{initials(c.name)}</div>
                    <div>
                      <div className="cx-cust-name">{c.name}</div>
                      <div className="cx-cust-id">{c.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`cx-badge cx-badge--${riskSlug(c.riskLevel)}`}>
                    {c.riskLevel}
                  </span>
                </td>
                <td className="cx-num">
                  <span
                    className={`cx-score cx-score--${riskSlug(c.riskLevel)}`}
                  >
                    {c.riskScore}
                  </span>
                </td>
                <td className="cx-num">{c.totalTransactions.toLocaleString()}</td>
                <td className="cx-num">{formatCurrency(c.totalValue)}</td>
                <td className="cx-muted">{formatRelative(c.lastActivity)}</td>
                <td>
                  <span
                    className={`cx-badge cx-badge--status-${c.accountStatus.toLowerCase()}`}
                  >
                    {c.accountStatus}
                  </span>
                </td>
                <td className="cx-row-action">
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="cx-empty">
                  <UserX size={28} />
                  <div>No customers match your filters.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- Drawer ---------- */}
      {selected && (
        <CustomerDrawer
          customer={selected}
          onClose={() => setSelected(null)}
          onOpenInvestigation={handleOpenInvestigation}
        />
      )}
    </div>
  );
}

/* ============================================================
   Customer Risk Profile Drawer
   ============================================================ */
function CustomerDrawer({ customer: c, onClose, onOpenInvestigation }) {
  return (
    <div className="cx-drawer-backdrop" onClick={onClose}>
      <aside
        className="cx-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Customer profile ${c.id}`}
      >
        {/* Header */}
        <header className="cx-drawer-header">
          <div className="cx-drawer-heading">
            <div className="cx-avatar cx-avatar--lg">{initials(c.name)}</div>
            <div>
              <div className="cx-drawer-eyebrow">{c.id}</div>
              <h2 className="cx-drawer-title">{c.name}</h2>
              <div className="cx-drawer-sub">
                <span className={`cx-badge cx-badge--${riskSlug(c.riskLevel)}`}>
                  {c.riskLevel}
                </span>
                <span className="cx-dot" />
                <span className="cx-muted">Risk Score {c.riskScore}/100</span>
              </div>
            </div>
          </div>
          <button
            className="cx-icon-btn"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </header>

        {/* Body */}
        <div className="cx-drawer-body">
          {/* Contact + account info */}
          <section className="cx-info-grid">
            <Info label="Email" value={c.email} />
            <Info label="Phone" value={c.phone} />
            <Info
              label="Location"
              value={c.location}
              icon={<MapPin size={12} />}
            />
            <Info
              label="Account Age"
              value={`${c.accountAgeDays} days`}
              icon={<Clock size={12} />}
            />
            <Info
              label="Account Status"
              value={
                <span
                  className={`cx-badge cx-badge--status-${c.accountStatus.toLowerCase()}`}
                >
                  {c.accountStatus}
                </span>
              }
            />
          </section>

          {/* Transaction behavior */}
          <section>
            <h3 className="cx-section-title">Transaction Behavior</h3>
            <div className="cx-stat-grid">
              <Stat
                label="Total Transactions"
                value={c.totalTransactions.toLocaleString()}
              />
              <Stat label="Total Value" value={formatCurrency(c.totalValue)} />
              <Stat
                label="Avg Transaction"
                value={formatCurrency(c.avgTransaction)}
              />
              <Stat label="Failed" value={c.failedTransactions} tone="warn" />
              <Stat
                label="Suspicious"
                value={c.suspiciousTransactions}
                tone="danger"
              />
            </div>
          </section>

          {/* Risk signals */}
          <section>
            <h3 className="cx-section-title">
              <ShieldAlert size={14} /> Risk Signals
            </h3>
            {c.riskSignals.length === 0 ? (
              <div className="cx-empty-note">No active risk signals.</div>
            ) : (
              <ul className="cx-signal-list">
                {c.riskSignals.map((s, i) => (
                  <li key={i} className={`cx-signal cx-signal--${s.severity}`}>
                    <span className="cx-signal-dot" />
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Device history */}
          <section>
            <h3 className="cx-section-title">
              <Smartphone size={14} /> Device History
            </h3>
            <ul className="cx-device-list">
              {c.devices.map((d) => (
                <li key={d.id} className="cx-device-item">
                  <span className="cx-device-id">{d.id}</span>
                  <span
                    className={`cx-device-tag ${
                      d.label === "Current" ? "cx-device-tag--current" : ""
                    }`}
                  >
                    {d.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="cx-drawer-footer">
          <button
            className="cx-btn cx-btn--primary"
            onClick={() => onOpenInvestigation(c)}
          >
            Open Investigation <ArrowUpRight size={14} />
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="cx-info">
      <div className="cx-info-label">
        {icon}
        {label}
      </div>
      <div className="cx-info-value">{value}</div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`cx-stat ${tone ? `cx-stat--${tone}` : ""}`}>
      <div className="cx-stat-value">{value}</div>
      <div className="cx-stat-label">{label}</div>
    </div>
  );
}