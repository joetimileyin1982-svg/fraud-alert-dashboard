import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import TransactionDrawer from "./TransactionDrawer";
import { transactions } from "../../src/data/transactions";
import { computeRiskScore } from "../../src/data/FraudRules";
import "./TransactionTable.css";

const riskBucket = (r) => {
  if (r >= 70) return "critical";
  if (r >= 50) return "high";
  if (r >= 25) return "review";
  return "low";
};

const statusLabel = (r) => {
  if (r >= 70) return "Critical";
  if (r >= 50) return "High Risk";
  if (r >= 25) return "Suspicious";
  return "Safe";
};

export default function TransactionTable() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="card">
        <h3 className="cardTitle">Recent Transactions</h3>

        <div className="cardControls">
          <div className="searchBox">
            <Search size={16} />
            <input placeholder="Search transactions..." />
          </div>

          <select className="selectBox">
            <option>Last 24h</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>

          <button className="filterBtn" aria-label="Filters">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="tableScroll">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Merchant</th>
                <th>Location</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => {
                const risk = computeRiskScore(item.rules);
                const bucket = riskBucket(risk);
                const status = statusLabel(risk);

                return (
                  <tr
                    key={item.id}
                    className="clickableRow"
                    onClick={() => setSelected({ ...item, risk, status })}
                  >
                    <td>{item.time}</td>
                    <td>{item.customer}</td>
                    <td>{item.amount}</td>
                    <td>{item.merchant}</td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`risk ${bucket}`}>{risk}</span>
                    </td>
                    <td>
                      <span className={`status ${bucket}`}>{status}</span>
                    </td>
                    <td>
                      <button
                        className="viewBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected({ ...item, risk, status });
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="emptyCell">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          Showing 1–{transactions.length} of 12,458 transactions
        </div>
      </div>

      {selected && (
        <TransactionDrawer
          transaction={selected}
          onClose={() => setSelected(null)}
          onOpenCustomer={(t) =>
            navigate(
              `/analyst/customers?search=${encodeURIComponent(t.customer)}`
            )
          }
          onOpenInvestigation={(t) =>
            navigate(
              `/analyst/investigations/new?txn=${encodeURIComponent(t.customer)}`
            )
          }
        />
      )}
    </>
  );
}