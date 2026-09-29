import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../src/utils/format";
import "./ThreatDrawer.css";

export default function ThreatDrawer({ threat, onClose }) {
  if (!threat) return null;

  const {
    id,
    title,
    description,
    severity,
    time,
    icon: Icon,
    color,
    transaction,
    rule,
  } = threat;

  const slug = severity.toLowerCase();

  return (
    <div className="td-backdrop" onClick={onClose}>
      <aside className="td-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Top row: icon / badge / close */}
        <div className="td-toprow">
          {Icon && (
            <div
              className="td-icon-circle"
              style={{
                color,
                backgroundColor: `${color}1A`,
                boxShadow: `0 0 12px ${color}33`,
              }}
            >
              <Icon size={20} />
            </div>
          )}
          <span className={`td-badge ${slug}`}>{severity}</span>
          <button
            className="td-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Centered title + time */}
        <div className="td-headcenter">
          <h2 className="td-title">{title}</h2>
          <span className="td-muted">{time}</span>
        </div>

        {/* Body */}
        <div className="td-body">
          <p className="td-description">{description}</p>

          {transaction && (
            <div className="td-block">
              <div className="td-block-title">Related Transaction</div>
              <div className="td-grid">
                <Detail label="Customer"   value={transaction.customer} />
                <Detail
                  label="Amount"
                  value={
                    typeof transaction.amount === "number"
                      ? formatCurrency(transaction.amount)
                      : transaction.amount
                  }
                />
                <Detail label="Merchant"   value={transaction.merchant} />
                <Detail label="Location"   value={transaction.location} />
                <Detail label="Risk Score" value={transaction.risk} />
              </div>
            </div>
          )}

          {rule && (
            <div className="td-block">
              <div className="td-block-title">Triggered Rule</div>
              <div className="td-rule-box">{rule}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="td-foot">
          <div className="td-foot-row">
            <button className="td-btn td-btn-ghost">Mark as Reviewed</button>
            <button className="td-btn td-btn-ghost">Escalate</button>
            <button className="td-btn td-btn-ghost">Dismiss</button>
          </div>
          <Link
            to={`/analyst/investigations/new?alert=${id}`}
            className="td-full-link"
            onClick={onClose}
          >
            <span>Open full investigation</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="td-info-label">{label}</div>
      <div className="td-info-value">{value}</div>
    </div>
  );
}