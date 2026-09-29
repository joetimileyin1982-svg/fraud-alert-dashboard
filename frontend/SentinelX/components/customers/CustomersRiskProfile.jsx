import {
  X,
  User,
  Smartphone,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { transactions } from "../../src/data/transactions";
import { computeRiskScore, riskBucket } from "../../src/data/FraudRules";
import "./CustomerRiskProfile.css";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const initials = (name) =>
  name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export default function CustomerRiskProfile({
  customer: c,
  onClose,
  onOpenInvestigation,
}) {
  if (!c) return null;

  const theirTxns = transactions.filter((t) => t.customer === c.name);

  return (
    <div className="crp-backdrop" onClick={onClose}>
      <aside className="crp-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="crp-head">
          <div className="crp-head-row">
            <div className="crp-avatar">{initials(c.name)}</div>
            <div className="crp-head-text">
              <div className="crp-eyebrow mono">{c.id}</div>
              <h2 className="crp-title">{c.name}</h2>
              <div className="crp-sub">
                <span className={`crp-badge ${c.bucket}`}>{c.label}</span>
                <span className="crp-muted">Score {c.score}/100</span>
              </div>
            </div>
          </div>
          <button className="crp-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="crp-body">
          {/* Contact */}
          <section className="crp-section">
            <h4>Customer Information</h4>
            <div className="crp-grid">
              <Info label="Email" value={c.email} />
              <Info label="Phone" value={c.phone} />
              <Info label="Location" value={c.location} icon={<MapPin size={12} />} />
              <Info label="Account Age" value={`${c.accountAgeDays} days`} icon={<Clock size={12} />} />
              <Info
                label="Status"
                value={
                  <span
                    className={`crp-badge status-${c.accountStatus.toLowerCase()}`}
                  >
                    {c.accountStatus}
                  </span>
                }
              />
            </div>
          </section>

          {/* Behavior */}
          <section className="crp-section">
            <h4>Transaction Behavior</h4>
            <div className="crp-stats">
              <Stat label="Total Txns" value={c.totalTransactions.toLocaleString()} />
              <Stat label="Total Value" value={formatCurrency(c.totalValue)} />
              <Stat label="Avg Txn" value={formatCurrency(c.avgTransaction)} />
              <Stat label="Failed" value={c.failedTransactions} tone="warn" />
              <Stat label="Suspicious" value={c.suspiciousTransactions} tone="danger" />
            </div>
          </section>

          {/* Risk signals */}
          <section className="crp-section">
            <h4>
              <ShieldAlert size={14} /> Risk Signals
            </h4>
            {c.riskSignals.length === 0 ? (
              <p className="crp-muted small">No active risk signals.</p>
            ) : (
              <ul className="crp-signals">
                {c.riskSignals.map((s, i) => (
                  <li key={i} className={`crp-signal ${s.severity}`}>
                    <span className="dot" />
                    {s.label}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Devices */}
          <section className="crp-section">
            <h4>
              <Smartphone size={14} /> Device History
            </h4>
            <ul className="crp-devices">
              {c.devices.map((d) => (
                <li key={d.id}>
                  <span className="crp-device-id mono">{d.id}</span>
                  <span className="crp-device-trust mono">
                    Trust {d.trust}
                  </span>
                  <span
                    className={`crp-device-tag ${
                      d.label === "Current" ? "current" : ""
                    }`}
                  >
                    {d.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent transactions */}
          <section className="crp-section">
            <h4>Recent Transactions ({theirTxns.length})</h4>
            {theirTxns.length === 0 ? (
              <p className="crp-muted small">No transactions on record.</p>
            ) : (
              <ul className="crp-txns">
                {theirTxns.slice(0, 5).map((t) => {
                  const score = computeRiskScore(t.rules);
                  const bucket = riskBucket(score);
                  return (
                    <li key={t.id}>
                      <div className="crp-txn-top">
                        <span className="crp-txn-id mono">{t.id}</span>
                        <span className={`crp-txn-score mono ${bucket}`}>
                          {score}
                        </span>
                      </div>
                      <div className="crp-txn-bottom">
                        <span className="crp-muted small">
                          {t.time} · {t.merchant}
                        </span>
                        <span className="crp-txn-amount mono">{t.amount}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="crp-foot">
          <button
            className="crp-btn"
            onClick={() => onOpenInvestigation?.(c)}
          >
            Open Investigation <ArrowUpRight size={14} />
          </button>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div>
      <div className="crp-info-label">
        {icon}
        {label}
      </div>
      <div className="crp-info-value">{value}</div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`crp-stat ${tone || ""}`}>
      <div className="crp-stat-value mono">{value}</div>
      <div className="crp-stat-label">{label}</div>
    </div>
  );
}