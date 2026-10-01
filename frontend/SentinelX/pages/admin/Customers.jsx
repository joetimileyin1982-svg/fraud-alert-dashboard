import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  ChevronRight,
  MoreVertical,
  Pencil,
  Power,
  Flag,
  Trash2,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Plus,
  Download,
} from "lucide-react";
import { customers as initialCustomers } from "../../src/data/customers";
import { transactions } from "../../src/data/transactions";
import {
  computeRiskScore,
  riskBucket,
  riskLabel,
} from "../../src/data/fraudRules";
import { formatCurrency } from "../../src/utils/format";
import CustomerFormDrawer from "../../components/admin/CustomerFormDrawer";
import "./styles/Customers.css";

const STATUS_FILTERS = ["All", "Active", "Suspended"];

function deriveRisk(customer) {
  const theirTxns = transactions.filter((t) => t.customer === customer.name);
  const scores = theirTxns.map((t) => computeRiskScore(t.rules));
  const maxScore = scores.length ? Math.max(...scores) : 0;
  return {
    score: maxScore,
    bucket: riskBucket(maxScore),
    label: riskLabel(maxScore),
  };
}

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const enriched = useMemo(
    () =>
      customers.map((c) => ({
        ...c,
        ...deriveRisk(c),
      })),
    [customers]
  );

  const kpis = useMemo(() => {
    const total = enriched.length;
    const active = enriched.filter((c) => c.accountStatus === "Active").length;
    const suspended = enriched.filter(
      (c) => c.accountStatus === "Suspended"
    ).length;
    const highRisk = enriched.filter(
      (c) => c.bucket === "critical" || c.bucket === "high"
    ).length;
    return { total, active, suspended, highRisk };
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || c.accountStatus === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [enriched, query, statusFilter]);

  // ============ Actions ============
  const toggleStatus = (customer) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id
          ? {
              ...c,
              accountStatus:
                c.accountStatus === "Active" ? "Suspended" : "Active",
            }
          : c
      )
    );
    setOpenMenuId(null);
  };

  const deleteCustomer = (customer) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    setConfirmDelete(null);
    setOpenMenuId(null);
  };

  const saveCustomer = (customer) => {
    if (customer.id) {
      // Update
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, ...customer } : c))
      );
    } else {
      // Create
      const newCustomer = {
        ...customer,
        id: `CUST-${String(1200 + customers.length + 1).padStart(4, "0")}`,
        lastActivity: new Date().toISOString(),
        devices: [],
        riskSignals: [],
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setEditing(null);
  };

  return (
    <div className="ac-page">
      {/* ============ Header ============ */}
      <header className="ac-header">
        <div>
          <h1>Customers</h1>
          <p>Oversee customer accounts, risk levels, and activity.</p>
        </div>
        <div className="ac-header-actions">
          <button className="ac-export">
            <Download size={13} /> Export
          </button>
          <button
            className="ac-create-btn"
            onClick={() => setEditing("new")}
          >
            <Plus size={13} /> Add Customer
          </button>
        </div>
      </header>

      {/* ============ KPI strip ============ */}
      <section className="ac-kpi-row">
        <KPI
          icon={Users}
          label="Total Customers"
          value={kpis.total}
          tone="cyan"
        />
        <KPI
          icon={UserCheck}
          label="Active"
          value={kpis.active}
          tone="green"
        />
        <KPI
          icon={UserX}
          label="Suspended"
          value={kpis.suspended}
          tone="red"
        />
        <KPI
          icon={AlertTriangle}
          label="High Risk"
          value={kpis.highRisk}
          tone="pink"
        />
      </section>

      {/* ============ Toolbar ============ */}
      <section className="ac-toolbar">
        <div className="ac-search">
          <Search size={16} />
          <input
            placeholder="Search by name, ID, email, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="ac-chips">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`ac-chip ${statusFilter === f ? "active" : ""}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ============ Table ============ */}
      <div className="ac-table-wrap">
        <table className="ac-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Location</th>
              <th className="num">Transactions</th>
              <th className="num">Total Value</th>
              <th className="num">Risk</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="ac-name">{c.name}</div>
                  <div className="ac-id mono">{c.id}</div>
                </td>
                <td className="ac-muted">{c.location}</td>
                <td className="num mono">
                  {c.totalTransactions.toLocaleString()}
                </td>
                <td className="num mono">
                  {formatCurrency(c.totalValue)}
                </td>
                <td className="num">
                  <span className={`ac-score mono ${c.bucket}`}>
                    {c.score}
                  </span>
                </td>
                <td>
                  <span
                    className={`ac-status status-${c.accountStatus.toLowerCase()}`}
                  >
                    {c.accountStatus}
                  </span>
                </td>
                <td className="ac-action-cell">
                  <button
                    className="ac-menu-btn"
                    onClick={() =>
                      setOpenMenuId(openMenuId === c.id ? null : c.id)
                    }
                    aria-label="Actions"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {openMenuId === c.id && (
                    <div
                      className="ac-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="ac-menu-item"
                        onClick={() => {
                          navigate(`/admin/customers/${c.id}`);
                          setOpenMenuId(null);
                        }}
                      >
                        <ChevronRight size={13} /> View Profile
                      </button>
                      <button
                        className="ac-menu-item"
                        onClick={() => {
                          setEditing(c);
                          setOpenMenuId(null);
                        }}
                      >
                        <Pencil size={13} /> Edit Customer
                      </button>
                      <button className="ac-menu-item">
                        <Flag size={13} /> Flag for Review
                      </button>
                      <button
                        className="ac-menu-item"
                        onClick={() => toggleStatus(c)}
                      >
                        <Power size={13} />
                        {c.accountStatus === "Active" ? "Suspend" : "Activate"}
                      </button>
                      <div className="ac-menu-divider" />
                      <button
                        className="ac-menu-item ac-menu-item-danger"
                        onClick={() => {
                          setConfirmDelete(c);
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
                <td colSpan={7} className="ac-empty">
                  No customers match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============ Create/Edit drawer ============ */}
      {editing && (
        <CustomerFormDrawer
          customer={editing === "new" ? null : editing}
          onSave={saveCustomer}
          onClose={() => setEditing(null)}
        />
      )}

      {/* ============ Delete confirmation ============ */}
      {confirmDelete && (
        <div
          className="ac-confirm-backdrop"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="ac-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete customer?</h3>
            <p>
              "<strong>{confirmDelete.name}</strong>" and their associated
              records will be permanently removed. This cannot be undone.
            </p>
            <div className="ac-confirm-actions">
              <button
                className="ac-btn ac-btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="ac-btn ac-btn-danger"
                onClick={() => deleteCustomer(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ Click outside to close menu ============ */}
      {openMenuId && (
        <div
          className="ac-menu-backdrop"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}

function KPI({ icon: Icon, label, value, tone }) {
  return (
    <div className={`ac-kpi ${tone}`}>
      <div className="ac-kpi-icon">
        <Icon size={18} />
      </div>
      <div className="ac-kpi-body">
        <div className="ac-kpi-label">{label}</div>
        <div className="ac-kpi-value mono">{value}</div>
      </div>
    </div>
  );
}