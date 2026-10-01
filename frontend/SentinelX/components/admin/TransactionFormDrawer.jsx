import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import "./TransactionFormDrawer.css";

const BLANK = {
  customer: "",
  amount: 0,
  merchant: "",
  merchantCategory: "Retail",
  merchantId: "",
  location: "",
  paymentType: "Card",
  device: "",
  deviceOS: "Android",
  deviceBrowser: "Chrome",
  ip: "",
  rules: [],
};

const PAYMENT_TYPES = ["Card", "Transfer", "USSD", "Cash"];
const MERCHANT_CATEGORIES = [
  "Retail",
  "Fintech",
  "E-commerce",
  "Transport",
  "Payments",
  "Banking",
  "Fitness",
  "Food",
  "Education",
];

const RULE_OPTIONS = [
  { key: "HIGH_AMOUNT", label: "High Amount" },
  { key: "NEW_DEVICE", label: "New Device" },
  { key: "NEW_LOCATION", label: "New Location" },
  { key: "VELOCITY", label: "Velocity" },
  { key: "MULTIPLE_ACCTS", label: "Multiple Accounts" },
  { key: "ODD_HOURS", label: "Unusual Time" },
];

export default function TransactionFormDrawer({
  transaction,
  customers,
  onSave,
  onClose,
}) {
  const isEdit = Boolean(transaction);
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    if (isEdit) {
      setForm({
        customer: transaction.customer || "",
        amount: transaction.amount ?? 0,
        merchant: transaction.merchant || "",
        merchantCategory: transaction.merchantCategory || "Retail",
        merchantId: transaction.merchantId || "",
        location: transaction.location || "",
        paymentType: transaction.paymentType || "Card",
        device: transaction.device || "",
        deviceOS: transaction.deviceOS || "Android",
        deviceBrowser: transaction.deviceBrowser || "Chrome",
        ip: transaction.ip || "",
        rules: transaction.rules || [],
      });
    } else {
      setForm(BLANK);
    }
  }, [transaction, isEdit]);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateNumber = (field, value) => {
    const n = Number(value);
    setForm((prev) => ({ ...prev, [field]: isNaN(n) ? 0 : n }));
  };

  const toggleRule = (key) => {
    setForm((prev) => {
      const has = prev.rules.includes(key);
      return {
        ...prev,
        rules: has
          ? prev.rules.filter((k) => k !== key)
          : [...prev.rules, key],
      };
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!form.customer.trim() || !form.merchant.trim()) return;

    const payload = { ...form };
    if (isEdit) payload.id = transaction.id;
    onSave(payload);
  };

  return (
    <div className="tfd-backdrop" onClick={onClose}>
      <aside className="tfd-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tfd-head">
          <div>
            <div className="tfd-eyebrow">
              {isEdit ? "Edit Transaction" : "New Transaction"}
            </div>
            <h2 className="tfd-title">
              {isEdit ? transaction.id : "Log a transaction"}
            </h2>
          </div>
          <button className="tfd-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form className="tfd-body" onSubmit={handleSubmit}>
          <div className="tfd-section-title">Transaction</div>

          <Field label="Customer">
            <select
              value={form.customer}
              onChange={(e) => update("customer", e.target.value)}
              required
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </Field>

          <div className="tfd-two-col">
            <Field label="Amount (₦)">
              <input
                type="number"
                min={0}
                value={form.amount}
                onChange={(e) => updateNumber("amount", e.target.value)}
                required
              />
            </Field>

            <Field label="Payment Type">
              <select
                value={form.paymentType}
                onChange={(e) => update("paymentType", e.target.value)}
              >
                {PAYMENT_TYPES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="tfd-section-title">Merchant</div>

          <Field label="Merchant Name">
            <input
              type="text"
              value={form.merchant}
              onChange={(e) => update("merchant", e.target.value)}
              placeholder="e.g. Krusty Mart"
              required
            />
          </Field>

          <div className="tfd-two-col">
            <Field label="Category">
              <select
                value={form.merchantCategory}
                onChange={(e) => update("merchantCategory", e.target.value)}
              >
                {MERCHANT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Merchant ID">
              <input
                type="text"
                value={form.merchantId}
                onChange={(e) => update("merchantId", e.target.value)}
                placeholder="MCH-12345"
              />
            </Field>
          </div>

          <div className="tfd-section-title">Location & Device</div>

          <Field label="Location">
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Lagos, NG"
            />
          </Field>

          <div className="tfd-two-col">
            <Field label="Device ID">
              <input
                type="text"
                value={form.device}
                onChange={(e) => update("device", e.target.value)}
                placeholder="DEV-88392"
              />
            </Field>

            <Field label="IP Address">
              <input
                type="text"
                value={form.ip}
                onChange={(e) => update("ip", e.target.value)}
                placeholder="102.89.43.21"
              />
            </Field>

            <Field label="OS">
              <select
                value={form.deviceOS}
                onChange={(e) => update("deviceOS", e.target.value)}
              >
                <option>Android</option>
                <option>iOS</option>
                <option>macOS</option>
                <option>Windows</option>
              </select>
            </Field>

            <Field label="Browser">
              <select
                value={form.deviceBrowser}
                onChange={(e) => update("deviceBrowser", e.target.value)}
              >
                <option>Chrome</option>
                <option>Safari</option>
                <option>Firefox</option>
                <option>Edge</option>
              </select>
            </Field>
          </div>

          <div className="tfd-section-title">Triggered Rules</div>

          <div className="tfd-rules">
            {RULE_OPTIONS.map((r) => (
              <label
                key={r.key}
                className={`tfd-rule ${form.rules.includes(r.key) ? "active" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={form.rules.includes(r.key)}
                  onChange={() => toggleRule(r.key)}
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>

          <p className="tfd-hint">
            The risk score is calculated automatically from the selected
            rules. Leave all rules unchecked for a clean transaction.
          </p>
        </form>

        {/* Footer */}
        <div className="tfd-foot">
          <button
            type="button"
            className="tfd-btn tfd-btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="tfd-btn tfd-btn-primary"
            onClick={handleSubmit}
          >
            <Save size={13} />
            {isEdit ? "Save Changes" : "Log Transaction"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="tfd-field">
      <label className="tfd-label">{label}</label>
      {children}
    </div>
  );
}