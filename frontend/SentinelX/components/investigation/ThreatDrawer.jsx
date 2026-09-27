import React from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import "./ThreatDrawer.css";

export default function ThreatDrawer({ threat, onClose }) {
  if (!threat) return null;

  const { id, title, description, severity, time, icon: Icon, color, transaction, rule } = threat;

  return (
    <div className="drawerOverlay" onClick={onClose}>
      <div className="drawerPanel" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <div
            className="drawerIconWrapper"
            style={{ color, backgroundColor: `${color}1A`, boxShadow: `0 0 12px ${color}33` }}
          >
            <Icon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <span className={`severityBadge ${severity.toLowerCase()}`}>{severity}</span>
            <h2 className="drawerTitle">{title}</h2>
            <p className="drawerTime">{time}</p>
          </div>
          <button className="drawerCloseBtn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="drawerDescription">{description}</p>

        {transaction && (
          <div className="drawerSection">
            <h4>Related Transaction</h4>
            <div className="drawerDetailGrid">
              <div><span>Customer</span><strong>{transaction.customer}</strong></div>
              <div><span>Amount</span><strong>{transaction.amount}</strong></div>
              <div><span>Merchant</span><strong>{transaction.merchant}</strong></div>
              <div><span>Location</span><strong>{transaction.location}</strong></div>
              <div><span>Risk Score</span><strong>{transaction.risk}</strong></div>
            </div>
          </div>
        )}

        {rule && (
          <div className="drawerSection">
            <h4>Triggered Rule</h4>
            <p className="drawerRuleName">{rule}</p>
          </div>
        )}

        <div className="drawerActions">
          <button className="actionBtn actionReview">Mark as Reviewed</button>
          <button className="actionBtn actionEscalate">Escalate</button>
          <button className="actionBtn actionDismiss">Dismiss</button>
        </div>

        <Link to={`/analyst/investigation?alert=${id}`} className="drawerFullLink" onClick={onClose}>
          <span>Open full investigation</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}