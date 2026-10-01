import React from "react";
import "./styles/Dashboard.css";
import StatCard from "../../components/analyst/dashboard/StatCard";
import TransactionTrendChart from "../../components/analyst/analytics/TransactionTrendChart";
import RiskDistributionChart from "../../components/analyst/analytics/RiskDistributionChart";
import TopRules from "../../components/analyst/analytics/TopRules";
import TransactionTable from "../../components/analyst/transactions/TransactionTable";
import RightPanel from "../../components/analyst/layout/RightPanel";

import {
  CircleCheckBig,
  ShieldCheck,
  TriangleAlert,
  Flame,
  Siren,
} from "lucide-react";

function Dashboard() {
  return (
    <main className="dashboardPage">
      {/* Left / Main Dashboard Content */}
      <div className="dashboardMainContent">
        {/* Stat Cards Row */}
        <section className="statGrid">
          <StatCard icon={<CircleCheckBig size={20} />} statTitle="Resolved" statNumber={12000} color="#A66CFF" />
          <StatCard icon={<ShieldCheck size={20} />} statTitle="Safe" statNumber={22346} color="#35F2B0" />
          <StatCard icon={<TriangleAlert size={20} />} statTitle="Suspicious" statNumber={1942} color="#FFE14A" />
          <StatCard icon={<Flame size={20} />} statTitle="High Risk" statNumber={412} color="#FF6B00" />
          <StatCard icon={<Siren size={20} />} statTitle="Critical" statNumber={193} color="#B00020" />
        </section>

        {/* Trend Chart */}
        <section>
          <TransactionTrendChart />
        </section>

        {/* Risk Distribution + Top Rules */}
        <section className="chartsGrid">
          <RiskDistributionChart />
          <TopRules />
        </section>

        {/* Table */}
        <section>
          <TransactionTable />
        </section>
      </div>

    </main>
  );
}

export default Dashboard;