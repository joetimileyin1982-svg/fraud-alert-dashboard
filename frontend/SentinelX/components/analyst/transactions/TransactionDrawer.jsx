import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { FRAUD_RULES } from "../../../src/data/FraudRules";
import { formatCurrency } from "../../../src/utils/format";
import "./TransactionDrawer.css";

const riskLevel = (score) => {
  if (score >= 70) return "Critical";
  if (score >= 50) return "High Risk";
  if (score >= 25) return "Suspicious";
  return "Safe";
};

const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

export default function TransactionDrawer({
  transaction: t,
  onClose,
  onOpenCustomer,
  onOpenInvestigation,
}) {
  if (!t) return null;

  const level = riskLevel(t.score ?? 0);
  const rules = (t.rules || []).map((key) => ({
    key,
    ...FRAUD_RULES[key],
  }));
  const total = rules.reduce((sum, r) => sum + r.weight, 0);

  const dateText = new Date(t.timestamp).toLocaleDateString("en-GB", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timeText = new Date(t.timestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="td-backdrop" onClick={onClose}>
      <aside className="td-drawer" onClick={(e) => e.stopPropagation()}>
        {/* ============ Header ============ */}
        <header className="td-head">
          <div className="td-head-left">
            <div className="td-head-icon">
              <ArrowUpRight size={16} />
            </div>
            <div>
              <h2 className="td-title">Transaction Details</h2>
              <div className="td-head-sub">
                <span className="mono">{t.id}</span>
                <span className={`td-badge ${slug(level)}`}>{level}</span>
              </div>
            </div>
          </div>

          <div className="td-head-right">
            <button className="td-nav-btn" aria-label="Previous">
              <ChevronLeft size={14} />
            </button>
            <span className="td-nav-index">1 of 12</span>
            <button className="td-nav-btn" aria-label="Next">
              <ChevronRight size={14} />
            </button>
            <button className="td-close" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </header>

        {/* ============ Amount + risk score ============ */}
        <section className="td-amount-row">
          <div>
            <div className="td-amount-value mono">
              {formatCurrency(t.amount)}
            </div>
            <div className="td-amount-sub">
              {dateText} · {timeText}
            </div>
          </div>
          <div className={`td-risk-score ${slug(level)}`}>
            <div className="td-risk-num mono">{t.score}</div>
            <div className="td-risk-label">Risk Score /100</div>
          </div>
        </section>

        {/* ============ Customer card ============ */}
        <section className="td-card">
          <div className="td-card-head">
            <span className="td-card-icon">👤</span>
            <h4>Customer</h4>
          </div>
          <div className="td-cust-row">
            <div className="td-cust-info">
              <div className="td-cust-avatar">
                {t.customer.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="td-cust-name">{t.customer}</div>
                <div className="td-cust-id mono">CUS-10382</div>
              </div>
            </div>
            <button
              className="td-outline-btn"
              onClick={() => onOpenCustomer?.(t)}
            >
              View Profile
            </button>
          </div>
          <ul className="td-kv">
            <li>
              <span>Email</span>
              <span>
                {t.customer.toLowerCase().replace(" ", ".")}@sentinelx.com
              </span>
            </li>
            <li>
              <span>Phone</span>
              <span>+234 801 234 5678</span>
            </li>
            <li>
              <span>Customer Since</span>
              <span>Jan 2025</span>
            </li>
            <li>
              <span>Account Status</span>
              <span className="td-status-dot">
                <i /> Active
              </span>
            </li>
          </ul>
        </section>

        {/* ============ Merchant card — info only ============ */}
        <section className="td-card">
          <div className="td-card-head">
            <span className="td-card-icon">🏪</span>
            <h4>Merchant</h4>
          </div>
          <div className="td-cust-row td-cust-row--simple">
            <div className="td-cust-info">
              <div>
                <div className="td-cust-name">{t.merchant}</div>
                <div className="td-cust-id">{t.location}</div>
              </div>
            </div>
          </div>
          <ul className="td-kv">
            <li>
              <span>Category</span>
              <span>{t.merchantCategory}</span>
            </li>
            <li>
              <span>Payment Type</span>
              <span>{t.paymentType}</span>
            </li>
            <li>
              <span>Merchant ID</span>
              <span className="mono">{t.merchantId}</span>
            </li>
          </ul>
        </section>

        {/* ============ Device card — info only ============ */}
        <section className="td-card">
          <div className="td-card-head">
            <span className="td-card-icon">📱</span>
            <h4>Device</h4>
          </div>
          <div className="td-cust-row td-cust-row--simple">
            <div className="td-cust-info">
              <div>
                <div className="td-cust-name">
                  {t.deviceOS} · {t.deviceBrowser}
                </div>
                <div className="td-cust-id mono">{t.device}</div>
              </div>
            </div>
          </div>
          <ul className="td-kv">
            <li>
              <span>IP Address</span>
              <span className="mono">{t.ip}</span>
            </li>
            <li>
              <span>Location</span>
              <span>{t.location}</span>
            </li>
            <li>
              <span>First Seen</span>
              <span>May 7, 2025 · 10:42 AM</span>
            </li>
          </ul>
        </section>

        {/* ============ Triggered rules ============ */}
        <section className="td-card">
          <div className="td-card-head">
            <span className="td-card-icon">⚠️</span>
            <h4>Triggered Rules</h4>
          </div>
          {rules.length === 0 ? (
            <p className="td-muted-sm">No rules triggered.</p>
          ) : (
            <ul className="td-rules">
              {rules.map((r) => (
                <li key={r.key}>
                  <span>{r.label}</span>
                  <span className="td-rule-weight mono">+{r.weight}</span>
                </li>
              ))}
              <li className="td-rule-total">
                <span>Total</span>
                <span className="mono">{total}</span>
              </li>
            </ul>
          )}
        </section>

        {/* ============ Actions ============ */}
        <footer className="td-actions">
          <div className="td-actions-row">
            <button className="td-btn td-btn-ghost">
              Mark as False Positive
            </button>
            <button className="td-btn td-btn-warn">Escalate</button>
          </div>
          <button
            className="td-btn td-btn-primary"
            onClick={() => onOpenInvestigation?.(t)}
          >
            Open Investigation
          </button>
        </footer>
      </aside>
    </div>
  );
}