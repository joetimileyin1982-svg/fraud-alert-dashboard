import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import "./RuleFormDrawer.css";

const CATEGORIES = ["Amount", "Device", "Location", "Behavior", "Identity"];

const BLANK = {
  label: "",
  key: "",
  description: "",
  condition: "",
  category: "Amount",
  weight: 15,
  active: true,
};

export default function RuleFormDrawer({ rule, onSave, onClose }) {
  const isEdit = Boolean(rule);

  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    if (isEdit) {
      setForm({
        label: rule.label || "",
        key: rule.key || "",
        description: rule.description || "",
        condition: rule.condition || "",
        category: rule.category || "Amount",
        weight: rule.weight ?? 15,
        active: rule.active ?? true,
      });
    } else {
      setForm(BLANK);
    }
  }, [rule, isEdit]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.condition.trim()) return;
    const payload = {
      ...form,
      key:
        form.key ||
        form.label.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, ""),
    };
    if (isEdit) payload.id = rule.id;
    onSave(payload);
  };

  return (
    <div className="rfd-backdrop" onClick={onClose}>
      <aside
        className="rfd-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="rfd-head">
          <div>
            <div className="rfd-eyebrow">
              {isEdit ? "Edit Rule" : "New Rule"}
            </div>
            <h2 className="rfd-title">
              {isEdit ? rule.label : "Create Fraud Rule"}
            </h2>
          </div>
          <button
            className="rfd-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form className="rfd-body" onSubmit={handleSubmit}>
          <Field label="Rule Name">
            <input
              type="text"
              value={form.label}
              onChange={(e) => update("label", e.target.value)}
              placeholder="e.g. High Transaction Amount"
              required
            />
          </Field>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short explanation of what this rule detects..."
            />
          </Field>

          <Field label="Condition">
            <input
              type="text"
              value={form.condition}
              onChange={(e) => update("condition", e.target.value)}
              placeholder="e.g. Amount > ₦500,000"
              required
            />
            <span className="rfd-hint">
              Free text — describing the logic that triggers this rule.
            </span>
          </Field>

          <Field label="Risk Weight">
            <div className="rfd-weight-row">
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={form.weight}
                onChange={(e) => update("weight", Number(e.target.value))}
                className="rfd-range"
              />
              <span className="rfd-weight-value mono">+{form.weight}</span>
            </div>
            <span className="rfd-hint">
              Contribution to a transaction's risk score when triggered (0–50).
            </span>
          </Field>

          <Field label="Status">
            <label className="rfd-toggle">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => update("active", e.target.checked)}
              />
              <span className="rfd-toggle-track">
                <span className="rfd-toggle-thumb" />
              </span>
              <span className="rfd-toggle-label">
                {form.active ? "Active" : "Inactive"}
              </span>
            </label>
          </Field>
        </form>

        {/* Footer */}
        <div className="rfd-foot">
          <button
            type="button"
            className="rfd-btn rfd-btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rfd-btn rfd-btn-primary"
            onClick={handleSubmit}
          >
            <Save size={13} /> {isEdit ? "Save Changes" : "Create Rule"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="rfd-field">
      <label className="rfd-label">{label}</label>
      {children}
    </div>
  );
}