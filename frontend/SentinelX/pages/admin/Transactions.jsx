import { useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Receipt,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Download,
} from "lucide-react";
import { transactions as initialTxns } from "../../src/data/transactions";
import { customers } from "../../src/data/customers";
import {
  computeRiskScore,
  riskBucket,
  riskLabel,
} from "../../src/data/FraudRules";
import { formatCurrency } from "../../src/utils/format";
import TransactionFormDrawer from "../../components/admin/TransactionFormDrawer";
import "./styles/Transactions.css";

const RISK_FILTERS = ["All", "Safe", "Suspicious", "High Risk", "Critical"];

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Transactions() {
  const [txns, setTxns] = useState(initialTxns);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ============ Enrich ============
  const enriched = useMemo(
    () =>
      txns.map((t) => {
        const score = computeRiskScore(t.rules);
        return {
          ...t,
          score,
          bucket: riskBucket(score),
          label: riskLabel(score),
        };
      }),
    [txns]
  );

  // ============ KPIs ============
  const kpis = useMemo(() => {
    const total = enriched.length;
    const counts = { low: 0, review: 0, high: 0, critical: 0 };
    enriched.forEach((t) => {
      counts[t.bucket] = (counts[t.bucket] || 0) + 1;
    });
    return {
      total,
      safe: counts.low,
      suspicious: counts.review,
      highRisk: counts.high,
      critical: counts.critical,
    };
  }, [enriched]);

  // ============ Filter ============
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched
      .filter((t) => {
        const matchesQuery =
          !q ||
          t.id.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.device?.toLowerCase().includes(q);
        const matchesRisk =
          riskFilter === "All" || t.label === riskFilter;
        return matchesQuery && matchesRisk;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [enriched, query, riskFilter]);

  // ============ Actions ============
  const deleteTxn = (txn) => {
    setTxns((prev) => prev.filter((t) => t.id !== txn.id));
    setConfirmDelete(null);
    setOpenMenuId(null);
  };

  const saveTxn = (txn) => {
    if (txn.id) {
      // Edit — preserve rules if not changed
      setTxns((prev) =>
        prev.map((t) => (t.id === txn.id ? { ...t, ...txn } : t))
      );
    } else {
      // Create
      const newTxn = {
        ...txn,
        id: `TXN-${String(93000 + txns.length + 1).padStart(6, "0")}`,
        timestamp:
          txn.timestamp || new Date().toISOString(),
      };
      setTxns((prev) => [newTxn, ...prev]);
    }
    setEditing(null);
  };

  return (
    <div className="at-page">
      {/* Header */}
      <header className="at-header">
        <div>
          <h1>Transactions</h1>
          <p>Log, review, and manage platform transactions.</p>
        </div>
        <div className="at-header-actions">
          <button className="at-export">
            <Download size={13} /> Export
          </button>
          <button
            className="at-create-btn"
            onClick={() => setEditing("new")}
          >
            <Plus size={13} /> Log Transaction
          </button>
        </div>
      </header>

      {/* KPI strip */}
      <section className="at-kpi-row">
        <KPI icon={Receipt} label="Total" value={kpis.total} tone="cyan" />
        <KPI icon={ShieldCheck} label="Safe" value={kpis.safe} tone="green" />
        <KPI
          icon={AlertTriangle}
          label="Suspicious"
          value={kpis.suspicious}
          tone="amber"
        />
        <KPI icon={AlertTriangle} label="High Risk" value={kpis.highRisk} tone="pink" />
        <KPI icon={AlertTriangle} label="Critical" value={kpis.critical} tone="red" />
      </section>

      {/* Toolbar */}
      <section className="at-toolbar">
        <div className="at-search">
          <Search size={16} />
          <input
            placeholder="Search by ID, customer, merchant, location, device..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="at-chips">
          {RISK_FILTERS.map((f) => (
            <button
              key={f}
              className={`at-chip ${riskFilter === f ? "active" : ""}`}
              onClick={() => setRiskFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Table */}
      <div className="at-table-wrap">
        <table className="at-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th className="num">Amount</th>
              <th>Merchant</th>
              <th>Location</th>
              <th className="num">Risk</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className="at-time">
                    <span>{formatTime(t.timestamp)}</span>
                    <span className="at-date">{formatDate(t.timestamp)}</span>
                  </div>
                </td>
                <td className="mono at-id">{t.id}</td>
                <td>{t.customer}</td>
                <td className="num mono">{formatCurrency(t.amount)}</td>
                <td>{t.merchant}</td>
                <td className="at-muted">{t.location}</td>
                <td className="num">
                  <span className={`at-score mono ${t.bucket}`}>{t.score}</span>
                </td>
                <td>
                  <span className={`at-status ${t.bucket}`}>{t.label}</span>
                </td>
                <td className="at-action-cell">
                  <button
                    className="at-menu-btn"
                    onClick={() =>
                      setOpenMenuId(openMenuId === t.id ? null : t.id)
                    }
                    aria-label="Actions"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {openMenuId === t.id && (
                    <div className="at-menu" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="at-menu-item"
                        onClick={() => {
                          setEditing(t);
                          setOpenMenuId(null);
                        }}
                      >
                        <Pencil size={13} /> Edit Transaction
                      </button>
                      <button className="at-menu-item">
                        <ChevronRight size={13} /> View Details
                      </button>
                      <div className="at-menu-divider" />
                      <button
                        className="at-menu-item at-menu-item-danger"
                        onClick={() => {
                          setConfirmDelete(t);
                          setOpenMenuId(null);
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="at-empty">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit drawer */}
      {editing && (
        <TransactionFormDrawer
          transaction={editing === "new" ? null : editing}
          customers={customers}
          onSave={saveTxn}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div
          className="at-confirm-backdrop"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="at-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete transaction?</h3>
            <p>
              Transaction "<strong>{confirmDelete.id}</strong>" will be
              permanently removed. This cannot be undone.
            </p>
            <div className="at-confirm-actions">
              <button
                className="at-btn at-btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="at-btn at-btn-danger"
                onClick={() => deleteTxn(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {openMenuId && (
        <div
          className="at-menu-backdrop"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}

function KPI({ icon: Icon, label, value, tone }) {
  return (
    <div className={`at-kpi ${tone}`}>
      <div className="at-kpi-icon">
        <Icon size={18} />
      </div>
      <div className="at-kpi-body">
        <div className="at-kpi-label">{label}</div>
        <div className="at-kpi-value mono">{value}</div>
      </div>
    </div>
  );
}