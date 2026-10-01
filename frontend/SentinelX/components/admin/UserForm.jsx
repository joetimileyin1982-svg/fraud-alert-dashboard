import { useState } from "react";
import { X } from "lucide-react";
import "./UserForm.css";

const ROLES = ["Analyst", "Admin"];
const STATUSES = ["Active", "Invited", "Suspended"];

export default function UserForm({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState({
    id: initial?.id || "",
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    department: initial?.department || "Fraud Operations",
    location: initial?.location || "",
    role: initial?.role || "Analyst",
    status: initial?.status || "Active",
  });

  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.email.trim()) return setError("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return setError("Please enter a valid email address.");

    onSave(form);
  };

  return (
    <div className="uf-backdrop" onClick={onClose}>
      <div
        className="uf-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="uf-head">
          <div>
            <h2>{isEdit ? "Edit User" : "Add User"}</h2>
            <p>
              {isEdit
                ? `Update ${initial.name}'s account details.`
                : "Create a new analyst or administrator account."}
            </p>
          </div>
          <button className="uf-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form className="uf-body" onSubmit={handleSubmit}>
          <div className="uf-row">
            <Field label="Full Name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Daisy Harper"
                autoFocus
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="name@sentinelx.io"
              />
            </Field>
          </div>

          <div className="uf-row">
            <Field label="Phone">
              <input
                type="tel"
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
                placeholder="Lagos, NG"
              />
            </Field>
          </div>

          <div className="uf-row">
            <Field label="Department">
              <input
                type="text"
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                placeholder="Fraud Operations"
              />
            </Field>

            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {isEdit && (
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {error && <div className="uf-error">{error}</div>}

          {/* Footer */}
          <div className="uf-foot">
            <button
              type="button"
              className="uf-btn uf-btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="uf-btn uf-btn-primary">
              {isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="uf-field">
      <span className="uf-field-label">{label}</span>
      {children}
    </label>
  );
}