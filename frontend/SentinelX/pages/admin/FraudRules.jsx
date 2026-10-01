import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Power,
  Trash2,
  Copy,
  ShieldCheck,
  Activity,
  AlertTriangle,
  TrendingUp,
  X,
} from "lucide-react";
import { FRAUD_RULES_LIST } from "../../src/data/FraudRules";
import RuleFormDrawer from "../../components/admin/RuleFormDrawer";
import "./styles/FraudRules.css";

const STATUS_FILTERS = ["All", "Active", "Inactive"];

export default function FraudRules() {
  const [rules, setRules] = useState(FRAUD_RULES_LIST);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editing, setEditing] = useState(null); // rule object or "new"
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ============ Derived ============
  const kpis = useMemo(() => {
    const active = rules.filter((r) => r.active).length;
    const totalTriggers = rules.reduce((s, r) => s + r.triggers, 0);
    const totalFP = rules.reduce((s, r) => s + r.falsePositives, 0);
    const avgFP = totalTriggers ? ((totalFP / totalTriggers) * 100).toFixed(1) : 0;
    const updatedToday = rules.filter((r) =>
      r.updatedAt.startsWith("2026-05")
    ).length;
    return { active, totalTriggers, avgFP, updatedToday };
  }, [rules]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rules.filter((r) => {
      const matchesQuery =
        !q ||
        r.label.toLowerCase().includes(q) ||
        r.condition.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && r.active) ||
        (statusFilter === "Inactive" && !r.active);
      return matchesQuery && matchesStatus;
    });
  }, [rules, query, statusFilter]);

  // ============ Actions ============
  const toggleActive = (rule) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === rule.id ? { ...r, active: !r.active } : r
      )
    );
    setOpenMenuId(null);
  };

  const duplicateRule = (rule) => {
    const newRule = {
      ...rule,
      id: `RULE-${String(rules.length + 1).padStart(3, "0")}`,
      key: `${rule.key}_COPY`,
      label: `${rule.label} (Copy)`,
      active: false,
      triggers: 0,
      falsePositives: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setRules((prev) => [...prev, newRule]);
    setOpenMenuId(null);
  };

  const deleteRule = (rule) => {
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
    setConfirmDelete(null);
    setOpenMenuId(null);
  };

  const saveRule = (rule) => {
    if (rule.id) {
      // Edit existing
      setRules((prev) =>
        prev.map((r) =>
          r.id === rule.id
            ? {
                ...r,
                ...rule,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : r
        )
      );
    } else {
      // Create new
      const newRule = {
        ...rule,
        id: `RULE-${String(rules.length + 1).padStart(3, "0")}`,
        triggers: 0,
        falsePositives: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setRules((prev) => [...prev, newRule]);
    }
    setEditing(null);
  };

  return (
    <div className="fr-page">
      {/* ============ Header ============ */}
      <header className="fr-header">
        <div>
          <h1>Fraud Rules</h1>
          <p>Manage detection rules, thresholds, and scoring weights.</p>
        </div>
        <button
          className="fr-create-btn"
          onClick={() => setEditing("new")}
        >
          <Plus size={14} /> Create Rule
        </button>
      </header>

      {/* ============ KPI strip ============ */}
      <section className="fr-kpi-row">
        <KPI icon={ShieldCheck} label="Active Rules" value={kpis.active} tone="green" />
        <KPI icon={Activity} label="Rule Triggers" value={kpis.totalTriggers.toLocaleString()} tone="cyan" />
        <KPI icon={AlertTriangle} label="Avg False Positive" value={`${kpis.avgFP}%`} tone="amber" />
        <KPI icon={TrendingUp} label="Updated This Month" value={kpis.updatedToday} tone="purple" />
      </section>

      {/* ============ Toolbar ============ */}
      <section className="fr-toolbar">
        <div className="fr-search">
          <Search size={16} />
          <input
            placeholder="Search by name, condition, category, ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="fr-chips">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`fr-chip ${statusFilter === f ? "active" : ""}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ============ Table ============ */}
      <div className="fr-table-wrap">
        <table className="fr-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Condition</th>
              <th>Category</th>
              <th className="num">Weight</th>
              <th className="num">Triggers</th>
              <th className="num">FP Rate</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const fpRate = r.triggers
                ? ((r.falsePositives / r.triggers) * 100).toFixed(1)
                : "0.0";
              return (
                <tr key={r.id}>
                  <td>
                    <div className="fr-rule-cell">
                      <span className={`fr-rule-dot ${r.active ? "active" : "inactive"}`} />
                      <div>
                        <div className="fr-rule-label">{r.label}</div>
                        <div className="fr-rule-id mono">{r.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="fr-rule-cond">{r.condition}</td>
                  <td>
                    <span className="fr-tag">{r.category}</span>
                  </td>
                  <td className="num mono">+{r.weight}</td>
                  <td className="num mono">{r.triggers.toLocaleString()}</td>
                  <td className="num mono">{fpRate}%</td>
                  <td>
                    <span className={`fr-status ${r.active ? "active" : "inactive"}`}>
                      {r.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="fr-action-cell">
                    <button
                      className="fr-menu-btn"
                      onClick={() =>
                        setOpenMenuId(openMenuId === r.id ? null : r.id)
                      }
                      aria-label="Actions"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {openMenuId === r.id && (
                      <div className="fr-menu" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="fr-menu-item"
                          onClick={() => {
                            setEditing(r);
                            setOpenMenuId(null);
                          }}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          className="fr-menu-item"
                          onClick={() => toggleActive(r)}
                        >
                          <Power size={13} />
                          {r.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="fr-menu-item"
                          onClick={() => duplicateRule(r)}
                        >
                          <Copy size={13} /> Duplicate
                        </button>
                        <div className="fr-menu-divider" />
                        <button
                          className="fr-menu-item fr-menu-item-danger"
                          onClick={() => {
                            setConfirmDelete(r);
                            setOpenMenuId(null);
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="fr-empty">
                  No rules match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============ Create/Edit drawer ============ */}
      {editing && (
        <RuleFormDrawer
          rule={editing === "new" ? null : editing}
          onSave={saveRule}
          onClose={() => setEditing(null)}
        />
      )}

      {/* ============ Delete confirm ============ */}
      {confirmDelete && (
        <div className="fr-confirm-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="fr-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Delete rule?</h3>
            <p>
              "<strong>{confirmDelete.label}</strong>" will be permanently removed.
              This cannot be undone.
            </p>
            <div className="fr-confirm-actions">
              <button
                className="fr-btn fr-btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="fr-btn fr-btn-danger"
                onClick={() => deleteRule(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close menus when clicking outside */}
      {openMenuId && (
        <div
          className="fr-menu-backdrop"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}

/* ============ KPI ============ */
function KPI({ icon: Icon, label, value, tone }) {
  return (
    <div className={`fr-kpi ${tone}`}>
      <div className="fr-kpi-icon">
        <Icon size={18} />
      </div>
      <div className="fr-kpi-body">
        <div className="fr-kpi-label">{label}</div>
        <div className="fr-kpi-value mono">{value}</div>
      </div>
    </div>
  );
}