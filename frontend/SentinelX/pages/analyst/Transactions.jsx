import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  Receipt,
} from "lucide-react";
import { transactions } from "../../src/data/transactions";
import { computeRiskScore, riskBucket, riskLabel } from "../../src/data/FraudRules";
import { formatCurrency } from "../../src/utils/format";
import TransactionDrawer from "../../components/transactions/TransactionDrawer";
import "./styles/Transactions.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const RISK_FILTERS = ["All", "Safe", "Suspicious", "High Risk", "Critical"];

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Transactions() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
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

  const kpis = useMemo(() => {
    const total = enriched.length;
    const counts = { low: 0, review: 0, high: 0, critical: 0 };
    enriched.forEach((t) => {
      counts[t.bucket] = (counts[t.bucket] || 0) + 1;
    });
    return {
      total,
      safe: counts.low,
      suspicious: counts.review,
      highRisk: counts.high,
      critical: counts.critical,
    };
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = enriched.filter((t) => {
      const matchQuery =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.device.toLowerCase().includes(q);
      const matchRisk = riskFilter === "All" || t.label === riskFilter;
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchPayment =
        paymentFilter === "All" || t.paymentType === paymentFilter;
      return matchQuery && matchRisk && matchStatus && matchPayment;
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
  }, [enriched, query, riskFilter, statusFilter, paymentFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const paginated = filtered.slice(pageStart, pageStart + pageSize);

  const resetPage = () => setPage(1);

  const clearAllFilters = () => {
    setQuery("");
    setRiskFilter("All");
    setStatusFilter("All");
    setPaymentFilter("All");
    resetPage();
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllOnPage = () => {
    const pageIds = paginated.map((t) => t.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const rangeStart = filtered.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + pageSize, filtered.length);

  return (
    <div className="tx-page">
      {/* Header */}
      <header className="tx-header">
        <div>
          <h1>Transactions</h1>
          <p>
            Monitor and review transaction activity. Look for suspicious patterns
            and take action when needed.
          </p>
        </div>
        <button className="tx-export">
          <Download size={14} /> Export Report
        </button>
      </header>

      {/* KPI strip — no deltas */}
      <section className="tx-kpi-row">
        <div className="tx-kpi cyan">
          <div className="tx-kpi-icon"><Receipt size={18} /></div>
          <div className="tx-kpi-body">
            <div className="tx-kpi-label">Total Transactions</div>
            <div className="tx-kpi-value mono">{kpis.total.toLocaleString()}</div>
          </div>
        </div>
        <div className="tx-kpi green">
          <div className="tx-kpi-icon"><Receipt size={18} /></div>
          <div className="tx-kpi-body">
            <div className="tx-kpi-label">Safe</div>
            <div className="tx-kpi-value mono">{kpis.safe.toLocaleString()}</div>
          </div>
        </div>
        <div className="tx-kpi amber">
          <div className="tx-kpi-icon"><Receipt size={18} /></div>
          <div className="tx-kpi-body">
            <div className="tx-kpi-label">Suspicious</div>
            <div className="tx-kpi-value mono">
              {kpis.suspicious.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="tx-kpi pink">
          <div className="tx-kpi-icon"><Receipt size={18} /></div>
          <div className="tx-kpi-body">
            <div className="tx-kpi-label">High Risk</div>
            <div className="tx-kpi-value mono">
              {kpis.highRisk.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="tx-kpi red">
          <div className="tx-kpi-icon"><Receipt size={18} /></div>
          <div className="tx-kpi-body">
            <div className="tx-kpi-label">Critical</div>
            <div className="tx-kpi-value mono">
              {kpis.critical.toLocaleString()}
            </div>
          </div>
        </div>
      </section>

      {/* Search + date + clear */}
      <section className="tx-filters">
        <div className="tx-search">
          <Search size={16} />
          <input
            placeholder="Search transaction ID, customer, merchant, device..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                resetPage();
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="tx-date-range">
          <ChevronDown size={14} />
          May 1, 2025 – May 7, 2025
        </div>

        <button className="tx-clear" onClick={clearAllFilters}>
          Clear Filters
        </button>
      </section>

      {/* Filter pills grid */}
      <section className="tx-filter-pills">
        <FilterPill label="Date Range" value="May 1 – May 7" />
        <FilterPill
          label="Risk Level"
          value={riskFilter}
          onChange={(v) => {
            setRiskFilter(v);
            resetPage();
          }}
          options={RISK_FILTERS}
        />
        <FilterPill
          label="Status"
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            resetPage();
          }}
          options={["All", "Approved", "In Review", "Unreviewed"]}
        />
        <FilterPill label="Location" value="All" />
        <FilterPill label="Merchant" value="All" />
        <FilterPill
          label="Payment Type"
          value={paymentFilter}
          onChange={(v) => {
            setPaymentFilter(v);
            resetPage();
          }}
          options={["All", "Card", "Transfer", "USSD"]}
        />
        <FilterPill label="Fraud Rule" value="All" />
        <FilterPill label="Reviewed" value="All" />
        <button className="tx-more-filters">
          <Filter size={12} /> More Filters
        </button>
      </section>

      {/* Table header */}
      <div className="tx-table-head-row">
        <h3>Transactions</h3>
        <span className="tx-count-badge mono">
          {filtered.length.toLocaleString()}
        </span>

        <div className="tx-sort-inline">
          <ArrowUpDown size={12} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="risk">Sort: Risk Score</option>
            <option value="amount">Sort: Amount</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th className="tx-check">
                <input
                  type="checkbox"
                  onChange={toggleAllOnPage}
                  checked={
                    paginated.length > 0 &&
                    paginated.every((t) => selectedIds.includes(t.id))
                  }
                />
              </th>
              <th>Time</th>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th className="num">Amount</th>
              <th>Merchant</th>
              <th>Location</th>
              <th className="num">Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr key={t.id} onClick={() => setSelected(t)}>
                <td className="tx-check" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(t.id)}
                    onChange={() => toggleRow(t.id)}
                  />
                </td>
                <td>
                  <div className="tx-time">
                    <span>{formatTime(t.timestamp)}</span>
                    <span className="tx-date">{formatDate(t.timestamp)}</span>
                  </div>
                </td>
                <td className="mono tx-id">{t.id}</td>
                <td>{t.customer}</td>
                <td className="num mono">{formatCurrency(t.amount)}</td>
                <td>{t.merchant}</td>
                <td>{t.location}</td>
                <td className="num">
                  <span className={`tx-score mono ${t.bucket}`}>{t.score}</span>
                </td>
                <td>
                  <span className={`tx-status ${t.bucket}`}>{t.label}</span>
                </td>
                <td className="tx-action" onClick={(e) => e.stopPropagation()}>
                  <button className="tx-view" onClick={() => setSelected(t)}>
                    View
                  </button>
                  <button className="tx-more" aria-label="More">
                    <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={10} className="tx-empty">
                  <Receipt size={26} />
                  <span>No transactions match your filters.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <footer className="tx-pagination">
        <div className="tx-page-info">
          Showing {rangeStart} – {rangeEnd} of {filtered.length.toLocaleString()}
        </div>

        <div className="tx-page-controls">
          <label className="tx-page-size">
            Rows per page:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button
            className="tx-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                className={`tx-page-num ${page === n ? "active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            );
          })}

          {totalPages > 5 && <span className="tx-page-ellipsis">…</span>}

          <button
            className="tx-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </footer>

      {selected && (
        <TransactionDrawer
          transaction={selected}
          onClose={() => setSelected(null)}
          onOpenCustomer={(t) =>
            navigate(`/analyst/customers?search=${encodeURIComponent(t.customer)}`)
          }
          onOpenInvestigation={(t) =>
            navigate(`/analyst/investigations/new?txn=${encodeURIComponent(t.id)}`)
          }
        />
      )}
    </div>
  );
}

function FilterPill({ label, value, options, onChange }) {
  const isActive = value && value !== "All";
  return (
    <div className={`tx-pill ${isActive ? "active" : ""}`}>
      <span className="tx-pill-label">{label}</span>
      {options ? (
        <select
          className="tx-pill-select"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <span className="tx-pill-value">{value}</span>
      )}
      <ChevronDown size={11} className="tx-pill-chevron" />
    </div>
  );
}