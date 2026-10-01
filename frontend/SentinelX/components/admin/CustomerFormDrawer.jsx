import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import "./CustomerFormDrawer.css";

const BLANK = {
  name: "",
  email: "",
  phone: "",
  location: "",
  accountAgeDays: 0,
  accountStatus: "Active",
  totalTransactions: 0,
  totalValue: 0,
  avgTransaction: 0,
  failedTransactions: 0,
  suspiciousTransactions: 0,
};

const STATUS_OPTIONS = ["Active", "Suspended", "Dormant"];

export default function CustomerFormDrawer({ customer, onSave, onClose }) {
  const isEdit = Boolean(customer);
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        location: customer.location || "",
        accountAgeDays: customer.accountAgeDays ?? 0,
        accountStatus: customer.accountStatus || "Active",
        totalTransactions: customer.totalTransactions ?? 0,
        totalValue: customer.totalValue ?? 0,
        avgTransaction: customer.avgTransaction ?? 0,
        failedTransactions: customer.failedTransactions ?? 0,
        suspiciousTransactions: customer.suspiciousTransactions ?? 0,
      });
    } else {
      setForm(BLANK);
    }
  }, [customer, isEdit]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateNumber = (field, value) => {
    const n = Number(value);
    setForm((prev) => ({ ...prev, [field]: isNaN(n) ? 0 : n }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const payload = { ...form };
    if (isEdit) payload.id = customer.id;
    onSave(payload);
  };

  return (
    <div className="cfd-backdrop" onClick={onClose}>
      <aside className="cfd-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cfd-head">
          <div>
            <div className="cfd-eyebrow">
              {isEdit ? "Edit Customer" : "New Customer"}
            </div>
            <h2 className="cfd-title">
              {isEdit ? customer.name : "Add a customer"}
            </h2>
          </div>
          <button className="cfd-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form className="cfd-body" onSubmit={handleSubmit}>
          <div className="cfd-section-title">Identity</div>

          <Field label="Full Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Patrick Star"
              required
            />
          </Field>

          <Field label="Email Address">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@example.com"
              required
            />
          </Field>

          <Field label="Phone">
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+234 801 234 5678"
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Lagos, NG"
            />
          </Field>

          <div className="cfd-section-title">Account</div>

          <div className="cfd-two-col">
            <Field label="Account Status">
              <select
                value={form.accountStatus}
                onChange={(e) => update("accountStatus", e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Account Age (days)">
              <input
                type="number"
                min={0}
                value={form.accountAgeDays}
                onChange={(e) => updateNumber("accountAgeDays", e.target.value)}
              />
            </Field>
          </div>

          <div className="cfd-section-title">Activity (optional)</div>

          <div className="cfd-two-col">
            <Field label="Total Transactions">
              <input
                type="number"
                min={0}
                value={form.totalTransactions}
                onChange={(e) => updateNumber("totalTransactions", e.target.value)}
              />
            </Field>

            <Field label="Total Value (₦)">
              <input
                type="number"
                min={0}
                value={form.totalValue}
                onChange={(e) => updateNumber("totalValue", e.target.value)}
              />
            </Field>

            <Field label="Avg Transaction (₦)">
              <input
                type="number"
                min={0}
                value={form.avgTransaction}
                onChange={(e) => updateNumber("avgTransaction", e.target.value)}
              />
            </Field>

            <Field label="Failed Transactions">
              <input
                type="number"
                min={0}
                value={form.failedTransactions}
                onChange={(e) => updateNumber("failedTransactions", e.target.value)}
              />
            </Field>

            <Field label="Suspicious Transactions">
              <input
                type="number"
                min={0}
                value={form.suspiciousTransactions}
                onChange={(e) =>
                  updateNumber("suspiciousTransactions", e.target.value)
                }
              />
            </Field>
          </div>

          <p className="cfd-hint">
            Device history and risk signals are managed automatically by the
            platform and will populate as transactions arrive.
          </p>
        </form>

        {/* Footer */}
        <div className="cfd-foot">
          <button
            type="button"
            className="cfd-btn cfd-btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cfd-btn cfd-btn-primary"
            onClick={handleSubmit}
          >
            <Save size={13} />
            {isEdit ? "Save Changes" : "Create Customer"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="cfd-field">
      <label className="cfd-label">{label}</label>
      {children}
    </div>
  );
}