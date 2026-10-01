import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Receipt,
  Smartphone,
  ShieldAlert,
  X,
} from "lucide-react";
import { customers } from "../src/data/customers";
import { transactions } from "../src/data/transactions";
import { alertsData } from "../src/data/AlertsData";
import { formatCurrency } from "../src/utils/format";
import "./GlobalSearch.css";

const MAX_PER_GROUP = 4;

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Keyboard shortcuts (⌘K / Ctrl+K focuses the input)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        wrapRef.current?.querySelector("input")?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        wrapRef.current?.querySelector("input")?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Build grouped results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedCustomers = customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_GROUP);

    const matchedTransactions = transactions
      .filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_GROUP);

    // Unique devices from transactions
    const deviceSet = new Map();
    transactions.forEach((t) => {
      if (t.device && !deviceSet.has(t.device)) {
        deviceSet.set(t.device, {
          id: t.device,
          os: t.deviceOS,
          browser: t.deviceBrowser,
          ip: t.ip,
          owner: t.customer,
          location: t.location,
        });
      }
    });
    const matchedDevices = Array.from(deviceSet.values())
      .filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.os.toLowerCase().includes(q) ||
          d.browser.toLowerCase().includes(q) ||
          d.owner.toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_GROUP);

    const matchedAlerts = alertsData
      .filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.transaction?.customer?.toLowerCase().includes(q) ||
          a.rule?.toLowerCase().includes(q)
      )
      .slice(0, MAX_PER_GROUP);

    const total =
      matchedCustomers.length +
      matchedTransactions.length +
      matchedDevices.length +
      matchedAlerts.length;

    return {
      customers: matchedCustomers,
      transactions: matchedTransactions,
      devices: matchedDevices,
      alerts: matchedAlerts,
      total,
    };
  }, [query]);

  // Flattened list for keyboard navigation
  const flat = useMemo(() => {
    if (!results) return [];
    return [
      ...results.customers.map((c) => ({
        kind: "customer",
        data: c,
        onSelect: () => navigate(`/analyst/customers?search=${encodeURIComponent(c.name)}`),
      })),
      ...results.transactions.map((t) => ({
        kind: "transaction",
        data: t,
        onSelect: () => navigate(`/analyst/transactions?txn=${encodeURIComponent(t.id)}`),
      })),
      ...results.devices.map((d) => ({
        kind: "device",
        data: d,
        onSelect: () => navigate(`/analyst/investigations?device=${encodeURIComponent(d.id)}`),
      })),
      ...results.alerts.map((a) => ({
        kind: "alert",
        data: a,
        onSelect: () => navigate(`/analyst/investigations/new?alert=${encodeURIComponent(a.id)}`),
      })),
    ];
  }, [results, navigate]);

  const handleKeyDown = (e) => {
    if (!open || !flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[activeIndex]?.onSelect();
      setOpen(false);
      setQuery("");
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div className="gs-wrap" ref={wrapRef}>
      <div className="gs-input-wrap">
        <Search size={16} className="gs-icon" />
        <input
          type="text"
          placeholder="Search customers, transactions, device IDs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="gs-input"
        />
        {query ? (
          <button
            className="gs-clear"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="gs-kbd">⌘K</kbd>
        )}
      </div>

      {showDropdown && (
        <div className="gs-dropdown">
          {results.total === 0 ? (
            <div className="gs-empty">
              No results for "<strong>{query}</strong>"
            </div>
          ) : (
            <>
              {results.customers.length > 0 && (
                <Group title="Customers" icon={<User size={12} />}>
                  {results.customers.map((c, i) => (
                    <ResultRow
                      key={c.id}
                      active={activeIndex === i}
                      onClick={() => {
                        navigate(
                          `/analyst/customers?search=${encodeURIComponent(c.name)}`
                        );
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="gs-row-main">{c.name}</div>
                      <div className="gs-row-sub mono">{c.id}</div>
                    </ResultRow>
                  ))}
                </Group>
              )}

              {results.transactions.length > 0 && (
                <Group
                  title="Transactions"
                  icon={<Receipt size={12} />}
                >
                  {results.transactions.map((t, i) => (
                    <ResultRow
                      key={t.id}
                      active={
                        activeIndex === results.customers.length + i
                      }
                      onClick={() => {
                        navigate(
                          `/analyst/transactions?txn=${encodeURIComponent(t.id)}`
                        );
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="gs-row-main mono">{t.id}</div>
                      <div className="gs-row-sub">
                        {t.customer} · {formatCurrency(t.amount)} · {t.merchant}
                      </div>
                    </ResultRow>
                  ))}
                </Group>
              )}

              {results.devices.length > 0 && (
                <Group title="Devices" icon={<Smartphone size={12} />}>
                  {results.devices.map((d, i) => (
                    <ResultRow
                      key={d.id}
                      active={
                        activeIndex ===
                        results.customers.length +
                          results.transactions.length +
                          i
                      }
                      onClick={() => {
                        navigate(
                          `/analyst/investigations?device=${encodeURIComponent(d.id)}`
                        );
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="gs-row-main mono">{d.id}</div>
                      <div className="gs-row-sub">
                        {d.os} · {d.browser} · {d.owner}
                      </div>
                    </ResultRow>
                  ))}
                </Group>
              )}

              {results.alerts.length > 0 && (
                <Group title="Alerts" icon={<ShieldAlert size={12} />}>
                  {results.alerts.map((a, i) => (
                    <ResultRow
                      key={a.id}
                      active={
                        activeIndex ===
                        results.customers.length +
                          results.transactions.length +
                          results.devices.length +
                          i
                      }
                      onClick={() => {
                        navigate(
                          `/analyst/investigations/new?alert=${encodeURIComponent(a.id)}`
                        );
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="gs-row-main">{a.title}</div>
                      <div className="gs-row-sub">
                        {a.transaction?.customer} · {a.rule}
                      </div>
                    </ResultRow>
                  ))}
                </Group>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ============ Small subcomponents ============ */

function Group({ title, icon, children }) {
  return (
    <div className="gs-group">
      <div className="gs-group-title">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function ResultRow({ active, onClick, children }) {
  return (
    <button
      className={`gs-row ${active ? "active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}