import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/SideBar";
import TopBar from "../components/layout/TopBar";
import RightPanel from "../components/layout/RightPanel";
import "./App.css";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminTransactions from "../pages/admin/Transactions";
import AdminCustomers from "../pages/admin/Customers";
import FraudRules from "../pages/admin/FraudRules";
import AdminNotifications from "../pages/admin/Notifications";
import AuditLog from "../pages/admin/AuditLog";

// Analyst pages
import AnalystDashboard from "../pages/analyst/Dashboard";
import AnalystTransactions from "../pages/analyst/Transactions";
import AnalystInvestigation from "../pages/analyst/Investigation";
import AnalystCustomers from "../pages/analyst/Customers";
import RiskAnalytics from "../pages/analyst/RiskAnalytics";
import AnalystNotifications from "../pages/analyst/Notifications";
import AnalystReports from "../pages/analyst/Reports";

function ProtectedShell() {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user.role === "Administrator";
  const fallback = isAdmin ? "/admin/dashboard" : "/analyst/dashboard";

  return (
    <div className="appShell">
      <Sidebar />

      <div className="mainArea">
        <div className="header">
          <TopBar />
        </div>

        <div className="pageBody">
          <div className="pageContent">
            <Routes>
              {/* ============ Admin routes ============ */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/rules" element={<FraudRules />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/audit-log" element={<AuditLog />} />

              {/* ============ Analyst routes ============ */}
              <Route path="/analyst/dashboard" element={<AnalystDashboard />} />
              <Route path="/analyst/transactions" element={<AnalystTransactions />} />
              <Route path="/analyst/investigations" element={<AnalystInvestigation />} />
              <Route path="/analyst/investigations/new" element={<AnalystInvestigation />} />
              <Route path="/analyst/investigations/:id" element={<AnalystInvestigation />} />
              <Route path="/analyst/customers" element={<AnalystCustomers />} />
              <Route path="/analyst/risk-analytics" element={<RiskAnalytics />} />
              <Route path="/analyst/notifications" element={<AnalystNotifications />} />
              <Route path="/analyst/reports" element={<AnalystReports />} />

              {/* Legacy singular route → plural */}
              <Route
                path="/analyst/investigation"
                element={<Navigate to="/analyst/investigations" replace />}
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to={fallback} replace />} />
            </Routes>
          </div>

          {/* Right panel — analyst-only */}
          {!isAdmin && <RightPanel />}
        </div>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={
        user.role === "Administrator"
          ? "/admin/dashboard"
          : "/analyst/dashboard"
      }
      replace
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Everything else behind auth */}
          <Route path="/*" element={<ProtectedShell />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}