// src/components/customers/CustomerTable.jsx
import Badge from "../common/Badge";
import { ChevronRight } from "lucide-react";
import "./CustomerTable.css";

function formatCurrency(n) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatRelative(iso) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CustomerTable({ customers, onRowClick }) {
  return (
    <div className="customer-table-wrapper">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Risk Level</th>
            <th className="num">Risk Score</th>
            <th className="num">Transactions</th>
            <th className="num">Total Value</th>
            <th>Last Activity</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr
              key={c.id}
              onClick={() => onRowClick?.(c)}
              className="customer-row"
            >
              <td>
                <div className="cust-cell">
                  <div className="cust-avatar">
                    {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="cust-name">{c.name}</div>
                    <div className="cust-id">{c.id}</div>
                  </div>
                </div>
              </td>
              <td><Badge label={c.riskLevel} /></td>
              <td className="num">
                <span className={`risk-score risk-score--${c.riskLevel.toLowerCase().replace(" ", "-")}`}>
                  {c.riskScore}
                </span>
              </td>
              <td className="num">{c.totalTransactions.toLocaleString()}</td>
              <td className="num">{formatCurrency(c.totalValue)}</td>
              <td className="muted">{formatRelative(c.lastActivity)}</td>
              <td><Badge label={c.accountStatus} /></td>
              <td className="row-action">
                <ChevronRight size={16} />
              </td>
            </tr>
          ))}

          {customers.length === 0 && (
            <tr>
              <td colSpan={8} className="empty-row">
                No customers match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}