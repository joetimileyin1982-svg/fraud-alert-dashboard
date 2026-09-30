import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, ChevronRight, UserX } from "lucide-react";
import { customers } from "../../src/data/customers";
import { transactions } from "../../src/data/transactions";
import { computeRiskScore, riskBucket, riskLabel } from "../../src/data/FraudRules";
import { formatCurrency } from "../../src/utils/format";
import CustomerRiskProfile from "../../components/customers/CustomersRiskProfile"
import "./styles/Customers.css";

const RISK_FILTERS = ["All", "Safe", "Suspicious", "High Risk", "Critical"];

function deriveCustomerRisk(customer) {
  const theirTxns = transactions.filter((t) => t.customer === customer.name);
  const scores = theirTxns.map((t) => computeRiskScore(t.rules));
  const maxScore = scores.length ? Math.max(...scores) : 0;
  return {
    score: maxScore,
    bucket: riskBucket(maxScore),
    label: riskLabel(maxScore),
  };
}

export default function Customers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const enriched = useMemo(
    () =>
      customers.map((c) => ({
        ...c,
        ...deriveCustomerRisk(c),
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      const matchesRisk = riskFilter === "All" || c.label === riskFilter;
      return matchesQuery && matchesRisk;
    });
  }, [enriched, query, riskFilter]);

  return (
    <div className="cx-page">
      <header className="cx-header">
        <h1>Customers</h1>
        <p>
          {filtered.length} of {customers.length} customers
        </p>
      </header>

      <div className="cx-toolbar">
        <div className="cx-search">
          <Search size={16} />
          <input
            placeholder="Search name, ID, email, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="cx-chips">
          {RISK_FILTERS.map((f) => (
            <button
              key={f}
              className={`cx-chip ${riskFilter === f ? "active" : ""}`}
              onClick={() => setRiskFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="cx-table-wrap">
        <table className="cx-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Risk Level</th>
              <th className="num">Score</th>
              <th className="num">Transactions</th>
              <th className="num">Total Value</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)}>
                <td>
                  <div className="cx-name">{c.name}</div>
                  <div className="cx-id">{c.id}</div>
                </td>
                <td>
                  <span className={`cx-badge ${c.bucket}`}>{c.label}</span>
                </td>
                <td className="num">
                  <span className={`cx-score mono ${c.bucket}`}>{c.score}</span>
                </td>
                <td className="num">{c.totalTransactions.toLocaleString()}</td>
                <td className="num">{formatCurrency(c.totalValue)}</td>
                <td>
                  <span
                    className={`cx-badge status-${c.accountStatus.toLowerCase()}`}
                  >
                    {c.accountStatus}
                  </span>
                </td>
                <td className="arrow">
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="cx-empty">
                  <UserX size={26} />
                  <span>No customers match your filters.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <CustomerRiskProfile
          customer={selected}
          onClose={() => setSelected(null)}
          onOpenInvestigation={(c) =>
            navigate(
              `/analyst/investigations/new?customer=${encodeURIComponent(c.id)}`
            )
          }
        />
      )}
    </div>
  );
}