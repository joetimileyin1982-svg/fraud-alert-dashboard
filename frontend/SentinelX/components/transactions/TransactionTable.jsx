import { Search, SlidersHorizontal } from "lucide-react";
import "./TransactionTable.css";

const Transactions = [
  { time: "09:45 AM", customer: "Bob Square", amount: "₦120,000", merchant: "Krusty Mart", location: "Krusty Coast", risk: 94, status: "Critical" },
  { time: "10:15 AM", customer: "Patty Star", amount: "₦450,000", merchant: "JellyPay", location: "Starfish Shore", risk: 60, status: "Review" },
  { time: "11:33 AM", customer: "Gary Shell", amount: "₦70,000", merchant: "Bikini Transfer", location: "Bubble Bay", risk: 80, status: "High Risk" },
  { time: "2:00 PM", customer: "Pearl Krabs", amount: "₦60,000", merchant: "Coral POS", location: "Coral Cove", risk: 9, status: "Safe" },
  { time: "3:10 PM", customer: "Squid Ink", amount: "₦1,250,000", merchant: "Pebble Pine", location: "Pearl Pier", risk: 85, status: "High Risk" },
  { time: "11:07 PM", customer: "Patty Star", amount: "₦3,450,000", merchant: "Shelly Bay", location: "Goo Lagoon", risk: 99, status: "Critical" },
  { time: "5:39 AM", customer: "Maple Muffin", amount: "₦940,000", merchant: "Pebble Pine", location: "Pearl Pier", risk: 5, status: "Safe" },
  { time: "4:59 AM", customer: "Coral Finch", amount: "₦50,000", merchant: "Drift Coffee", location: "Rocky Reef", risk: 98, status: "Critical" },
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