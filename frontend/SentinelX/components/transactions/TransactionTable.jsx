import { Search, SlidersHorizontal } from "lucide-react";
import "./TransactionTable.css";

const Transactions = [
  { time: "09:45 AM", customer: "Bob Square", amount: "₦450,000", merchant: "Krusty Mart", location: "Lagos, NG", risk: 92, status: "Critical" },
  { time: "09:45 AM", customer: "Patty Star", amount: "₦450,000", merchant: "JellyPay", location: "Lagos, NG", risk: 92, status: "Critical" },
  { time: "09:45 AM", customer: "Gary Shell", amount: "₦450,000", merchant: "Bikini Transfer", location: "Lagos, NG", risk: 92, status: "Critical" },
  { time: "09:45 AM", customer: "Pearl Krabs", amount: "₦450,000", merchant: "Coral POS", location: "Lagos, NG", risk: 92, status: "Critical" },
  { time: "09:45 AM", customer: "Squid Ink", amount: "₦450,000", merchant: "Pebble Pine", location: "Lagos, NG", risk: 92, status: "Critical" },
  { time: "09:45 AM", customer: "Patty Star", amount: "₦450,000", merchant: "Shelly Bay", location: "Lagos, NG", risk: 92, status: "Critical" },
  { time: "09:45 AM", customer: "Maple Muffin", amount: "₦450,000", merchant: "Pebble Pine", location: "Lagos, NG", risk: 92, status: "Critical" },
  { time: "09:45 AM", customer: "Coral Finch", amount: "₦450,000", merchant: "Drift Coffee", location: "Lagos, NG", risk: 92, status: "Critical" },
];

export default function TransactionTable() {
  return (
    <div className="tableCard">
      <h3 className="tableTitle">Recent Transactions</h3>

      <div className="tableHeader">
        <div className="tableControls">
          <div className="searchBox">
            <Search size={16} />
            <input placeholder="Search transactions..." />
          </div>
          <select>
            <option>Last 24h</option>
          </select>
          <button className="filterBtn">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="tableScrollArea">
        <table>
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
            {Transactions.map((item, index) => (
              <tr key={index}>
                <td>{item.time}</td>
                <td>{item.customer}</td>
                <td>{item.amount}</td>
                <td>{item.merchant}</td>
                <td>{item.location}</td>
                <td>
                  <span className={`risk risk${item.risk >= 90 ? "Critical" : item.risk >= 70 ? "High" : "Review"}`}>
                    {item.risk}
                  </span>
                </td>
                <td>
                  <span className={`status ${item.status.replace(/\s+/g, "")}`}>{item.status}</span>
                </td>
                <td>
                  <button className="viewBtn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">Showing 1-8 of 12,458 transactions</div>
    </div>
  );
}