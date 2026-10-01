import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login({ email, password });
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

  const fillDemo = (role) => {
    if (role === "admin") {
      setEmail("admin@sentinelx.io");
      setPassword("admin123");
    } else {
      setEmail("analyst@sentinelx.io");
      setPassword("analyst123");
    }
    setError("");
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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">
          Sign in to access your SentinelX console.
        </p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-label">Work Email</span>
            <div className="auth-input">
              <Mail size={15} />
              <input
                type="email"
                placeholder="you@sentinelx.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          <button type="submit" className="auth-submit">
            Sign In <ArrowRight size={14} />
          </button>
        </form>

        <div className="auth-demo">
          <span className="auth-demo-label">Demo accounts</span>
          <div className="auth-demo-buttons">
            <button type="button" onClick={() => fillDemo("admin")}>
              Admin
            </button>
            <button type="button" onClick={() => fillDemo("analyst")}>
              Analyst
            </button>
          </div>
        </div>

        <div className="auth-foot">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}