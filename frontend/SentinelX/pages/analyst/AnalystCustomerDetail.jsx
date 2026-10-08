import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  Clock,
  ShieldAlert,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";
import { customers } from "../../src/data/customers";
import { transactions } from "../../src/data/transactions";
import {
  computeRiskScore,
  riskBucket,
  riskLabel,
} from "../../src/data/FraudRules";
import { formatCurrency } from "../../src/utils/format";
import "./CustomerDetail.css";

export default function AnalystCustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="acd-page">
        <div className="acd-empty">
          <ShieldAlert size={26} />
          <div>Customer not found.</div>
          <button
            className="acd-btn acd-btn-primary"
            onClick={() => navigate("/analyst/customers")}
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const theirTxns = transactions.filter((t) => t.customer === customer.name);
  const scores = theirTxns.map((t) => computeRiskScore(t.rules));
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const bucket = riskBucket(maxScore);
  const label = riskLabel(maxScore);

  return (
    <div className="acd-page">
      {/* ============ Back button ============ */}
      <button className="acd-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* ============ Header ============ */}
      <header className="acd-header">
        <div>
          <div className="acd-eyebrow mono">{customer.id}</div>
          <h1>{customer.name}</h1>
          <div className="acd-sub">
            <span className={`acd-badge ${bucket}`}>{label}</span>
            <span className="acd-muted mono">{maxScore} / 100</span>
            <span className="acd-dot" />
            <span className="acd-muted">{customer.location}</span>
          </div>
        </div>

        <div className="acd-header-actions">
          <span
            className={`acd-status status-${customer.accountStatus.toLowerCase()}`}
          >
            {customer.accountStatus}
          </span>
          <button
            className="acd-btn acd-btn-primary"
            onClick={() =>
              navigate(
                `/analyst/investigations/new?customer=${encodeURIComponent(
                  customer.id
                )}`
              )
            }
          >
            Open Investigation <ArrowUpRight size={13} />
          </button>
        </div>
      </header>

      {/* ============ Contact ============ */}
      <section className="acd-card">
        <h3>
          <User size={14} /> Customer Information
        </h3>
        <div className="acd-grid">
          <Info label="Email" value={customer.email} />
          <Info label="Phone" value={customer.phone} />
          <Info
            label="Location"
            value={customer.location}
            icon={<MapPin size={12} />}
          />
          <Info
            label="Account Age"
            value={`${customer.accountAgeDays} days`}
            icon={<Clock size={12} />}
          />
        </div>
      </section>

      {/* ============ Behavior ============ */}
      <section className="acd-card">
        <h3>Transaction Behavior</h3>
        <div className="acd-stats">
          <Stat
            label="Total Transactions"
            value={customer.totalTransactions.toLocaleString()}
          />
          <Stat
            label="Total Value"
            value={formatCurrency(customer.totalValue)}
          />
          <Stat
            label="Avg Transaction"
            value={formatCurrency(customer.avgTransaction)}
          />
          <Stat label="Failed" value={customer.failedTransactions} tone="warn" />
          <Stat
            label="Suspicious"
            value={customer.suspiciousTransactions}
            tone="danger"
          />
        </div>
      </section>

      {/* ============ Risk signals (analyst-only) ============ */}
      {customer.riskSignals && customer.riskSignals.length > 0 && (
        <section className="acd-card">
          <h3>
            <ShieldAlert size={14} /> Risk Signals
          </h3>
          <ul className="acd-signals">
            {customer.riskSignals.map((s, i) => (
              <li key={i} className={`acd-signal ${s.severity}`}>
                <span className="acd-signal-dot" />
                {s.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============ Devices ============ */}
      <section className="acd-card">
        <h3>
          <Smartphone size={14} /> Device History
        </h3>
        <ul className="acd-devices">
          {customer.devices?.map((d) => (
            <li key={d.id}>
              <span className="mono acd-device-id">{d.id}</span>
              <span
                className={`acd-device-tag ${
                  d.label === "Current" ? "current" : ""
                }`}
              >
                {d.label}
              </span>
              <span
                className={`acd-trust mono ${
                  d.trust < 40 ? "danger" : d.trust < 70 ? "warn" : "safe"
                }`}
              >
                Trust {d.trust}
              </span>
            </li>
          ))}
          {(!customer.devices || customer.devices.length === 0) && (
            <li className="acd-muted">No devices on record.</li>
          )}
        </ul>
      </section>

      {/* ============ Recent transactions ============ */}
      {theirTxns.length > 0 && (
        <section className="acd-card">
          <h3>Recent Transactions ({theirTxns.length})</h3>
          <table className="acd-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Merchant</th>
                <th>Location</th>
                <th className="num">Risk</th>
              </tr>
            </thead>
            <tbody>
              {theirTxns.slice(0, 10).map((t) => {
                const score = computeRiskScore(t.rules);
                const b = riskBucket(score);
                return (
                  <tr key={t.id}>
                    <td className="mono">{t.id}</td>
                    <td className="mono">{formatCurrency(t.amount)}</td>
                    <td>{t.merchant}</td>
                    <td className="acd-muted">{t.location}</td>
                    <td className="num">
                      <span className={`acd-score mono ${b}`}>{score}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div>
      <div className="acd-info-label">
        {icon}
        {label}
      </div>
      <div className="acd-info-value">{value}</div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`acd-stat ${tone || ""}`}>
      <div className="acd-stat-value mono">{value}</div>
      <div className="acd-stat-label">{label}</div>
    </div>
  );
}