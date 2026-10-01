import { useMemo, useState } from "react";
import {
  Search,
  X,
  ShieldAlert,
  User as UserIcon,
  Shield,
  Cpu,
  Receipt,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
} from "lucide-react";
import { auditLog, ACTION_CATEGORIES, ACTOR_FILTERS } from "../../src/data/auditLog";
import "./styles/AuditLog.css";

const CATEGORY_ICONS = {
  Rule: ShieldAlert,
  Transaction: Receipt,
  Investigation: MessageSquare,
  User: UserIcon,
  Report: FileText,
  System: Cpu,
};

const SEVERITY_ICONS = {
  info: Info,
  warn: AlertTriangle,
  critical: ShieldAlert,
};

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function groupByDay(entries) {
  const groups = {};
  entries.forEach((e) => {
    const day = formatDate(e.timestamp);
    if (!groups[day]) groups[day] = [];
    groups[day].push(e);
  });
  return groups;
}

export default function AuditLog() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actorFilter, setActorFilter] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditLog
      .filter((e) => {
        const matchesQuery =
          !q ||
          e.actor.toLowerCase().includes(q) ||
          e.actionLabel.toLowerCase().includes(q) ||
          e.target.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.details?.toLowerCase().includes(q);
        const matchesCategory =
          categoryFilter === "All" || e.category === categoryFilter;
        const matchesActor =
          actorFilter === "All" || e.role === actorFilter;
        return matchesQuery && matchesCategory && matchesActor;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [query, categoryFilter, actorFilter]);

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);
  const dayKeys = Object.keys(grouped);

  return (
    <div className="al-page">
      {/* Header */}
      <header className="al-header">
        <div>
          <h1>Audit Log</h1>
          <p>Chronological record of administrative and system activity.</p>
        </div>
      </header>

      {/* Toolbar */}
      <section className="al-toolbar">
        <div className="al-search">
          <Search size={16} />
          <input
            placeholder="Search actor, action, target, ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="al-selects">
          <select
            className="al-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {ACTION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            className="al-select"
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
          >
            {ACTOR_FILTERS.map((a) => (
              <option key={a} value={a}>
                {a === "All" ? "All Actors" : a}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Summary strip */}
      <section className="al-summary">
        <span className="al-summary-count mono">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </span>
        {(categoryFilter !== "All" || actorFilter !== "All" || query) && (
          <button
            className="al-clear"
            onClick={() => {
              setQuery("");
              setCategoryFilter("All");
              setActorFilter("All");
            }}
          >
            Clear filters
          </button>
        )}
      </section>

      {/* Feed */}
      <div className="al-feed">
        {dayKeys.length === 0 ? (
          <div className="al-empty">
            <Activity size={26} />
            <span>No audit entries match your filters.</span>
          </div>
        ) : (
          dayKeys.map((day) => (
            <div key={day} className="al-day-group">
              <div className="al-day-label">{day}</div>
              <ul className="al-day-list">
                {grouped[day].map((e) => (
                  <AuditEntry key={e.id} entry={e} />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AuditEntry({ entry }) {
  const CatIcon = CATEGORY_ICONS[entry.category] || Activity;
  const SevIcon = SEVERITY_ICONS[entry.severity] || Info;

  return (
    <li className={`al-entry sev-${entry.severity}`}>
      <div className={`al-entry-icon cat-${entry.category.toLowerCase()}`}>
        <CatIcon size={14} />
      </div>

      <div className="al-entry-body">
        <div className="al-entry-top">
          <span className="al-entry-actor">{entry.actor}</span>
          <span className={`al-entry-role role-${entry.role.toLowerCase().replace(/\s+/g, "-")}`}>
            {entry.role}
          </span>
          <span className="al-entry-time mono">{formatTime(entry.timestamp)}</span>
        </div>

        <div className="al-entry-action">{entry.actionLabel}</div>
        <div className="al-entry-target">{entry.target}</div>
        {entry.details && (
          <div className="al-entry-details">{entry.details}</div>
        )}
      </div>

      <div className={`al-entry-severity sev-${entry.severity}`}>
        <SevIcon size={14} />
      </div>
    </li>
  );
}