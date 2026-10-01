import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userRoles } from "../../src/data/users";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Fraud Analyst",
    location: "",
  });
  const [error, setError] = useState("");

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const result = register(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    const dest =
      result.user.role === "Administrator"
        ? "/admin/dashboard"
        : "/analyst/dashboard";
    navigate(dest, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="auth-brand-name">SentinelX</div>
            <div className="auth-brand-sub">
              Fraud Detection & Risk Intelligence
            </div>
          </div>
        </div>

        <h1 className="auth-title">Register your account</h1>
        <p className="auth-subtitle">
          Create your SentinelX credentials to access the platform.
        </p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-label">Full Name</span>
            <div className="auth-input">
              <User size={15} />
              <input
                type="text"
                placeholder="e.g. Daisy Harper"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </label>

          <label className="auth-field">
            <span className="auth-label">Work Email</span>
            <div className="auth-input">
              <Mail size={15} />
              <input
                type="email"
                placeholder="you@sentinelx.io"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="auth-field">
            <span className="auth-label">Password</span>
            <div className="auth-input">
              <Lock size={15} />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </label>

          <label className="auth-field">
            <span className="auth-label">Role</span>
            <div className="auth-input">
              <ShieldCheck size={15} />
              <select
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
              >
                {userRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </label>

          <label className="auth-field">
            <span className="auth-label">Location (optional)</span>
            <div className="auth-input">
              <MapPin size={15} />
              <input
                type="text"
                placeholder="e.g. Lagos, NG"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>
          </label>

          <button type="submit" className="auth-submit">
            Register <ArrowRight size={14} />
          </button>
        </form>

        <div className="auth-foot">
          Already registered?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}