import "../../styles/Dashboard.css";
import StatCard from "../../components/dashboard/StatCard";
import TransactionTrendChart from "../../components/analytics/TransactionTrendChart";
import RiskDistributionChart from "../../components/analytics/RiskDistributionChart";
import TopRules from "../../components/analytics/TopRules";
import TransactionTable from "../../components/transactions/TransactionTable";

 import {CircleCheckBig,
  ShieldCheck,
  TriangleAlert,
  Flame,
  Siren,
} from "lucide-react";

function Dashboard() {
  return (
    <main className="dashboardPage" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Stat Cards Row */}
   <section className="statGrid">
        <StatCard icon={<CircleCheckBig size={20} />} statTitle="Resolved" statNumber={12000} color="#A66CFF" />
        <StatCard icon={<ShieldCheck size={20} />} statTitle="Safe" statNumber={22346} color="#35F2B0" />
        <StatCard icon={<TriangleAlert size={20} />} statTitle="Suspicious" statNumber={1942} color="#FFE14A" />
        <StatCard icon={<Flame size={20} />} statTitle="High Risk" statNumber={412} color="#FF6B00" />
        <StatCard icon={<Siren size={20} />} statTitle="Critical" statNumber={193} color="#B00020" />
      </section>


      {/* Trend Chart — its own full-width row */}
      <section>
        <TransactionTrendChart />
      </section>

      {/* Risk Distribution + Top Rules — together, side by side */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }}>
        <RiskDistributionChart />
        <TopRules />
      </section>

      {/* Table — its own full-width row */}
      <section>
        <TransactionTable />
      </section>

    </main>
  );
}

export default Dashboard;