import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/layout/SideBar";
import TopBar from "../components/layout/TopBar";
import RightPanel from "../components/layout/RightPanel";
import "./App.css";

// Analyst pages
import AnalystDashboard from "../pages/analyst/Dashboard";
import Transactions from "../pages/analyst/Transactions";
import Investigation from "../pages/analyst/Investigation";
import RiskAnalytics from "../pages/analyst/RiskAnalytics";
import Notifications from "../pages/analyst/Notifications";

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
                <Route path="/analyst/investigation" element={<Investigation />} />
                <Route path="/analyst/risk-analytics" element={<RiskAnalytics />} />
                <Route path="/analyst/notifications" element={<Notifications />} />

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