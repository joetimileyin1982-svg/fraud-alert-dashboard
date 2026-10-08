import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  Clock,
  ShieldAlert,
  Smartphone,
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

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="cd-page">
        <div className="cd-empty">
          <ShieldAlert size={26} />
          <div>Customer not found.</div>
          <button
            className="cd-btn"
            onClick={() => navigate("/admin/customers")}
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
    <div className="cd-page">
      <button className="cd-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> Back
      </button>

      <header className="cd-header">
        <div>
          <div className="cd-eyebrow mono">{customer.id}</div>
          <h1>{customer.name}</h1>
          <div className="cd-sub">
            <span className={`cd-badge ${bucket}`}>{label}</span>
            <span className="cd-muted mono">{maxScore} / 100</span>
          </div>
        </div>
        <span
          className={`cd-status status-${customer.accountStatus.toLowerCase()}`}
        >
          {customer.accountStatus}
        </span>
      </header>

      <section className="cd-card">
        <h3>
          <User size={14} /> Customer Information
        </h3>
        <div className="cd-grid">
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

      <section className="cd-card">
        <h3>Transaction Behavior</h3>
        <div className="cd-stats">
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

      <section className="cd-card">
        <h3>
          <Smartphone size={14} /> Device History
        </h3>
        <ul className="cd-devices">
          {customer.devices?.map((d) => (
            <li key={d.id}>
              <span className="mono">{d.id}</span>
              <span
                className={`cd-device-tag ${
                  d.label === "Current" ? "current" : ""
                }`}
              >
                {d.label}
              </span>
              <span className="cd-muted mono">Trust {d.trust}</span>
            </li>
          ))}
          {(!customer.devices || customer.devices.length === 0) && (
            <li className="cd-muted">No devices on record.</li>
          )}
        </ul>
      </section>

      {theirTxns.length > 0 && (
        <section className="cd-card">
          <h3>Recent Transactions ({theirTxns.length})</h3>
          <table className="cd-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Merchant</th>
                <th className="num">Risk</th>
              </tr>
            </thead>
            <tbody>
              {theirTxns.slice(0, 8).map((t) => {
                const score = computeRiskScore(t.rules);
                const b = riskBucket(score);
                return (
                  <tr key={t.id}>
                    <td className="mono">{t.id}</td>
                    <td className="mono">{formatCurrency(t.amount)}</td>
                    <td>{t.merchant}</td>
                    <td className="num">
                      <span className={`cd-score mono ${b}`}>{score}</span>
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
      <div className="cd-info-label">
        {icon}
        {label}
      </div>
      <div className="cd-info-value">{value}</div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`cd-stat ${tone || ""}`}>
      <div className="cd-stat-value mono">{value}</div>
      <div className="cd-stat-label">{label}</div>
    </div>
  );
}