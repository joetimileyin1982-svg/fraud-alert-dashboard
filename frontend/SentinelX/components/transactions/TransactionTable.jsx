import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import TransactionDrawer from "./TransactionDrawer";
import "./TransactionTable.css";

const Transactions = [
  { time: "09:45 AM", customer: "Bob Square",   amount: "₦120,000",   merchant: "Krusty Mart",     location: "Krusty Coast",   risk: 94 },
  { time: "10:15 AM", customer: "Patty Star",   amount: "₦450,000",   merchant: "JellyPay",        location: "Starfish Shore", risk: 60 },
  { time: "11:33 AM", customer: "Gary Shell",   amount: "₦70,000",    merchant: "Bikini Transfer", location: "Bubble Bay",     risk: 80 },
  { time: "02:00 PM", customer: "Pearl Krabs",  amount: "₦60,000",    merchant: "Coral POS",       location: "Coral Cove",     risk: 9  },
  { time: "03:10 PM", customer: "Squid Ink",    amount: "₦1,250,000", merchant: "Pebble Pine",     location: "Pearl Pier",     risk: 85 },
  { time: "11:07 PM", customer: "Patty Star",   amount: "₦3,450,000", merchant: "Shelly Bay",      location: "Goo Lagoon",     risk: 99 },
  { time: "05:39 AM", customer: "Maple Muffin", amount: "₦940,000",   merchant: "Pebble Pine",     location: "Pearl Pier",     risk: 5  },
  { time: "04:59 AM", customer: "Coral Finch",  amount: "₦50,000",    merchant: "Drift Coffee",    location: "Rocky Reef",     risk: 98 },
  { time: "08:21 AM", customer: "Sandy Cheeks", amount: "₦2,100,000", merchant: "Acorn Bank",      location: "Kelp Forest",    risk: 76 },
  { time: "12:48 PM", customer: "Mr. Krabs",    amount: "₦8,500,000", merchant: "Krusty Mart",     location: "Bikini Bottom",  risk: 91 },
  { time: "07:12 AM", customer: "Plankton",     amount: "₦180,000",   merchant: "Chum Bucket",     location: "Bikini Bottom",  risk: 55 },
  { time: "01:30 PM", customer: "Larry Lobster",amount: "₦320,000",   merchant: "Goo Lagoon Gym",  location: "Goo Lagoon",     risk: 22 },
  { time: "06:05 PM", customer: "Mrs. Puff",    amount: "₦45,000",    merchant: "Boat School",     location: "Bikini Bottom",  risk: 12 },
  { time: "09:12 PM", customer: "Barnacle Boy", amount: "₦1,750,000", merchant: "Mermaid Man Inc", location: "Atlantis",       risk: 88 },
  { time: "03:45 AM", customer: "Mermaid Man",  amount: "₦5,200,000", merchant: "Atlantis Bank",   location: "Atlantis",       risk: 95 },
];

/* --- Derived values --------------------------------------------------- */

// Risk score → bucket
const riskBucket = (r) => {
  if (r >= 90) return "critical";
  if (r >= 70) return "high";
  if (r >= 40) return "review";
  return "low";
};

// Bucket → display label for the Status column
const statusLabel = (r) => {
  if (r >= 90) return "Critical";
  if (r >= 70) return "High Risk";
  if (r >= 40) return "Suspicious";
  return "Safe";
};

// ====================================================================

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
              {Transactions.map((item, i) => {
                const bucket = riskBucket(item.risk);
                const status = statusLabel(item.risk);

                return (
                  <tr
                    key={i}
                    className="clickableRow"
                    onClick={() => setSelected({ ...item, status })}
                  >
                    <td>{item.time}</td>
                    <td>{item.customer}</td>
                    <td>{item.amount}</td>
                    <td>{item.merchant}</td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`risk ${bucket}`}>{item.risk}</span>
                    </td>
                    <td>
                      <span className={`status ${bucket}`}>{status}</span>
                    </td>
                    <td>
                      <button
                        className="viewBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected({ ...item, status });
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {Transactions.length === 0 && (
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
          Showing 1–{Transactions.length} of 12,458 transactions
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