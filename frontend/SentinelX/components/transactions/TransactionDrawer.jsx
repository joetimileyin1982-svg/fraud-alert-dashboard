import { X, ArrowUpRight } from "lucide-react";
import { FRAUD_RULES } from "../../src/data/FraudRules";
import "./TransactionDrawer.css";

const riskLevel = (score) => {
  if (score >= 70) return "Critical";
  if (score >= 50) return "High Risk";
  if (score >= 25) return "Suspicious";
  return "Safe";
};

const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

export default function TransactionDrawer({
  transaction,
  onClose,
  onOpenCustomer,
  onOpenInvestigation,
}) {
  if (!transaction) return null;
  const t = transaction;
  const level = riskLevel(t.risk);

  const triggeredRules = (t.rules || []).map((key) => ({
    key,
    ...FRAUD_RULES[key],
  }));

  const total = triggeredRules.reduce((sum, r) => sum + r.weight, 0);

  return (
    <div className="drawerOverlay" onClick={onClose}>
      <div className="drawerPanel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawerHeader">
          <div className={`drawerIconWrapper ${slug(level)}`}>
            <ArrowUpRight size={20} />
          </div>
          <div className="drawerHeaderText">
            <span className={`severityBadge ${slug(level)}`}>{level}</span>
            <h2 className="drawerTitle mono">{t.id}</h2>
            <p className="drawerTime mono">{t.time}</p>
          </div>
          <button
            className="drawerCloseBtn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount */}
        <div className="drawerAmount">
          <div className="drawerAmountValue mono">{t.amount}</div>
          <div className="drawerAmountLabel">Transaction Amount</div>
        </div>

        {/* Details */}
        <div className="drawerSection">
          <h4>Transaction Details</h4>
          <div className="drawerDetailGrid">
            <div>
              <span>Customer</span>
              <strong>{t.customer}</strong>
            </div>
            <div>
              <span>Merchant</span>
              <strong>{t.merchant}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{t.location}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong className="mono">{t.time}</strong>
            </div>
            <div>
              <span>Device</span>
              <strong className="mono">DEV-88392</strong>
            </div>
            <div>
              <span>Payment Type</span>
              <strong>Card</strong>
            </div>
          </div>
        </div>

        {/* Risk score */}
        <div className="drawerSection">
          <h4>Risk Score</h4>
          <div className="riskRow">
            <div className="riskBar">
              <div
                className={`riskFill ${slug(level)}`}
                style={{ width: `${t.risk}%` }}
              />
            </div>
            <div className={`riskValue mono ${slug(level)}`}>
              {t.risk} / 100
            </div>
          </div>
        </div>

        {/* Triggered rules */}
        <div className="drawerSection">
          <h4>Triggered Rules</h4>
          {triggeredRules.length === 0 ? (
            <p className="ruleEmpty">No rules triggered.</p>
          ) : (
            <ul className="ruleList">
              {triggeredRules.map((r, i) => (
                <li key={i}>
                  <span className="ruleLabel">{r.label}</span>
                  <span className="ruleDots" />
                  <span className="ruleWeight mono">+{r.weight}</span>
                </li>
              ))}
              <li className="ruleTotal">
                <span className="ruleLabel">Total</span>
                <span className="ruleDots" />
                <span className="ruleWeight mono">{total}</span>
              </li>
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="drawerActions">
          <button
            className="actionBtn actionSecondary"
            onClick={() => onOpenCustomer?.(t)}
          >
            View Customer
          </button>
          <button
            className="actionBtn actionPrimary"
            onClick={() => onOpenInvestigation?.(t)}
          >
            Open Investigation
          </button>
        </div>
      </div>
    </div>
  );
}