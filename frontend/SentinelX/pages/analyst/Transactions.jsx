import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Receipt,
  ChevronRight,
} from "lucide-react";
import { transactions } from "../../src/data/transactions";
import { computeRiskScore, riskBucket, riskLabel } from "../../src/data/FraudRules";
import { formatCurrency, formatDateTime } from "../../src/utils/format";
import TransactionDrawer from "../../components/transactions/TransactionDrawer";
import "../../styles/Transactions.css";

const TIME_RANGES = [
  { value: "24h", label: "Last 24h",  ms: 24 * 60 * 60 * 1000 },
  { value: "7d",  label: "Last 7 days", ms: 7 * 24 * 60 * 60 * 1000 },
  { value: "30d", label: "Last 30 days", ms: 30 * 24 * 60 * 60 * 1000 },
  { value: "all", label: "All time",   ms: Infinity },
];

const RISK_FILTERS = ["All", "Safe", "Suspicious", "High Risk", "Critical"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "risk",   label: "Highest risk" },
  { value: "amount", label: "Highest amount" },
];

export default function Transactions() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [range, setRange] = useState("24h");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selected, setSelected] = useState(null);

  const enriched = useMemo(
    () =>
      transactions.map((t) => {
        const score = computeRiskScore(t.rules);
        return {
          ...t,
          score,
          bucket: riskBucket(score),
          label: riskLabel(score),
        };
      }),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();
    const rangeMs = TIME_RANGES.find((r) => r.value === range)?.ms ?? Infinity;

    const result = enriched.filter((t) => {
      const matchesQuery =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q);

      const inRange =
        rangeMs === Infinity || now - new Date(t.timestamp).getTime() <= rangeMs;

      const matchesRisk = riskFilter === "All" || t.label === riskFilter;

      return matchesQuery && inRange && matchesRisk;
    });

    result.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === "oldest")
        return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortBy === "risk") return b.score - a.score;
      if (sortBy === "amount") return b.amount - a.amount;
      return 0;
    });

    return result;
  }, [enriched, query, range, riskFilter, sortBy]);

  return (
    <div className="tx-page">
      <header className="tx-header">
        <h1>Transactions</h1>
        <p>
          {filtered.length} of {transactions.length} transactions
        </p>
      </header>

      <div className="tx-toolbar">
        <div className="tx-search">
          <Search size={16} />
          <input
            placeholder="Search ID, customer, merchant, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="tx-chips">
          <SlidersHorizontal size={14} className="tx-chip-icon" />
          {RISK_FILTERS.map((f) => (
            <button
              key={f}
              className={`tx-chip ${riskFilter === f ? "active" : ""}`}
              onClick={() => setRiskFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="tx-selects">
          <select
            className="tx-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            {TIME_RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <div className="tx-sort">
            <ArrowUpDown size={14} />
            <select
              className="tx-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Merchant</th>
              <th>Location</th>
              <th className="num">Risk</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} onClick={() => setSelected(t)}>
                <td className="mono">{formatDateTime(t.timestamp)}</td>
                <td>{t.customer}</td>
                <td className="num mono">{formatCurrency(t.amount)}</td>
                <td>{t.merchant}</td>
                <td>{t.location}</td>
                <td className="num">
                  <span className={`tx-score mono ${t.bucket}`}>{t.score}</span>
                </td>
                <td>
                  <span className={`tx-badge ${t.bucket}`}>{t.label}</span>
                </td>
                <td className="tx-arrow">
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="tx-empty">
                  <Receipt size={26} />
                  <span>No transactions match your filters.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
              `/analyst/investigations/new?txn=${encodeURIComponent(t.id)}`
            )
          }
        />
      )}
    </div>
  );
}