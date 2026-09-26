import "../../styles/Dashboard.css";
import StatCard from "../../components/dashboard/StatCard";
import TransactionTrendChart from "../../components/analytics/TransactionTrendChart";
import RiskDistributionChart from "../../components/analytics/RiskDistributionChart";
import TopRules from "../../components/analytics/TopRules";

import {
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  AlertTriangle,
} from "lucide-react";

function Dashboard() {
  return (
    <main className="dashboardPage" style={{ padding: "24px", boxSizing: "border-box" }}>
      <section className="statGrid">
        <StatCard icon={<CreditCard size={20} />} statTitle="Total Transactions" statNumber={12000} color="#A66CFF" />
        <StatCard icon={<ShieldCheck size={20} />} statTitle="Resolved" statNumber={22346} color="#35F2B0" />
        <StatCard icon={<AlertTriangle size={20} />} statTitle="Flagged for Review" statNumber={1942} color="#FFE14A" />
        <StatCard icon={<UserRound size={20} />} statTitle="High Risk" statNumber={412} color="#FF3B81" />
        <StatCard icon={<ShieldAlert size={20} />} statTitle="Critical" statNumber={193} color="#FF1744" />
      </section>

      <section className="chartSection">
        <div
          className="chartsRow"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginTop: "24px",
            alignItems: "start",
          }}
        >
          <TransactionTrendChart />

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <RiskDistributionChart/>
            <TopRules />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;