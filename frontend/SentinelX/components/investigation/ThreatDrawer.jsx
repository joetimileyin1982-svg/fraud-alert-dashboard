import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
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
        {/* Header */}
        <div className="td-head">
          <div className="td-head-text">
            <div className="td-eyebrow">
              {Icon && <Icon size={12} style={{ color }} />}
              Threat Alert
            </div>
            <h2 className="td-title">{title}</h2>
            <div className="td-sub">
              <span className={`td-badge ${slug}`}>{severity}</span>
              <span className="td-dot" />
              <span className="td-muted">{time}</span>
            </div>
          </div>
          <button className="td-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="td-body">
          {/* Description */}
          <p className="td-description">{description}</p>

          {/* Related transaction */}
          {transaction && (
            <div className="td-block">
              <div className="td-block-title">Related Transaction</div>
              <div className="td-grid">
                <Detail label="Customer" value={transaction.customer} />
                <Detail label="Amount" value={transaction.amount} />
                <Detail label="Merchant" value={transaction.merchant} />
                <Detail label="Location" value={transaction.location} />
                <Detail label="Risk Score" value={transaction.risk} />
              </div>
            </div>
          )}

          {/* Triggered rule */}
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
            <button className="td-btn td-btn-ghost">Mark Reviewed</button>
            <button className="td-btn td-btn-ghost">Dismiss</button>
            <button className="td-btn td-btn-danger">Escalate</button>
          </div>
          <Link
            to={`/analyst/investigation?alert=${id}`}
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