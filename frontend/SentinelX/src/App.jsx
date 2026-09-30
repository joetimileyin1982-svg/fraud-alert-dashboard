import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/layout/SideBar";
import TopBar from "../components/layout/TopBar";
import RightPanel from "../components/layout/RightPanel";
import "./App.css";

// Analyst pages
import AnalystDashboard from "../pages/analyst/Dashboard";
import Transactions from "../pages/analyst/Transactions";
import Investigation from "../pages/analyst/Investigation";
import Customers from "../pages/analyst/Customers";
import RiskAnalytics from "../pages/analyst/RiskAnalytics";
import Notifications from "../pages/analyst/Notifications";
import Reports from "../pages/analyst/Reports";

function App() {
  return (
    <BrowserRouter>
      <div className="appShell">
        <Sidebar />

        <div className="mainArea">
          <div className="header">
            <TopBar />
          </div>

          <div className="pageBody">
            <div className="pageContent">
              <Routes>
                <Route path="/analyst/dashboard" element={<AnalystDashboard />} />
                <Route path="/analyst/transactions" element={<Transactions />} />

                {/* Investigations — plural, with new + id variants */}
                <Route path="/analyst/investigations" element={<Investigation />} />
                <Route path="/analyst/investigations/new" element={<Investigation />} />
                <Route path="/analyst/investigations/:id" element={<Investigation />} />

                <Route path="/analyst/customers" element={<Customers />} />
                <Route path="/analyst/risk-analytics" element={<RiskAnalytics />} />
                <Route path="/analyst/notifications" element={<Notifications />} />
                <Route path="/analyst/reports" element={<Reports />} />

                {/* Redirect legacy singular → plural */}
                <Route
                  path="/analyst/investigation"
                  element={<Navigate to="/analyst/investigations" replace />}
                />

                <Route path="*" element={<Navigate to="/analyst/dashboard" replace />} />
              </Routes>
            </div>

            <RightPanel />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;