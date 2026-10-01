import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  FileText,
  Users as UsersIcon,
  ChevronRight,
  Bell,
  BellOff,
} from "lucide-react";
import {
  adminNotifications,
  ADMIN_NOTIFICATION_CATEGORIES,
  ADMIN_NOTIFICATION_SEVERITIES,
} from "../../src/data/adminNotifications";
import "./styles/Notifications.css";

const CATEGORY_ICONS = {
  System: Cpu,
  Rules: ShieldAlert,
  Reports: FileText,
  Users: UsersIcon,
};

const SEVERITY_ICONS = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState(adminNotifications);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((n) => {
        const matchesQuery =
          !q ||
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q);
        const matchesCategory =
          categoryFilter === "All" || n.category === categoryFilter;
        const matchesSeverity =
          severityFilter === "All" ||
          n.severity.toLowerCase() === severityFilter.toLowerCase();
        const matchesUnread = !unreadOnly || !n.read;
        return matchesQuery && matchesCategory && matchesSeverity && matchesUnread;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [items, query, categoryFilter, severityFilter, unreadOnly]);

  const markAsRead = (id) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleAction = (n) => {
    markAsRead(n.id);
    if (n.action?.to) navigate(n.action.to);
  };

  return (
    <div className="ntf-page">
      <header className="ntf-header">
        <div>
          <h1>
            Notifications
            {unreadCount > 0 && (
              <span className="ntf-unread-badge">{unreadCount}</span>
            )}
          </h1>
          <p>System alerts, rule warnings, and platform events.</p>
        </div>
        {unreadCount > 0 && (
          <button className="ntf-mark-all" onClick={markAllRead}>
            <CheckCircle2 size={13} /> Mark all as read
          </button>
        )}
      </header>

      <section className="ntf-toolbar">
        <div className="ntf-search">
          <Search size={16} />
          <input
            placeholder="Search notifications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="ntf-selects">
          <select
            className="ntf-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {ADMIN_NOTIFICATION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            className="ntf-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            {ADMIN_NOTIFICATION_SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Severities" : s}
              </option>
            ))}
          </select>

          <button
            className={`ntf-toggle ${unreadOnly ? "active" : ""}`}
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            <BellOff size={12} /> Unread only
          </button>
        </div>
      </section>

      <div className="ntf-list">
        {filtered.length === 0 ? (
          <div className="ntf-empty">
            <Bell size={26} />
            <span>No notifications match your filters.</span>
          </div>
        ) : (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onClick={() => handleAction(n)}
              onMarkRead={() => markAsRead(n.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NotificationItem({ notification: n, onClick, onMarkRead }) {
  const CatIcon = CATEGORY_ICONS[n.category] || Bell;
  const SevIcon = SEVERITY_ICONS[n.severity] || Info;

  return (
    <div className={`ntf-item sev-${n.severity} ${n.read ? "read" : "unread"}`}>
      <div className={`ntf-item-icon cat-${n.category.toLowerCase()}`}>
        <CatIcon size={16} />
      </div>

      <div className="ntf-item-body">
        <div className="ntf-item-top">
          <span className="ntf-item-title">{n.title}</span>
          {!n.read && <span className="ntf-unread-dot" />}
        </div>
        <div className="ntf-item-desc">{n.description}</div>
        <div className="ntf-item-meta">
          <span className={`ntf-tag sev-${n.severity}`}>
            <SevIcon size={11} /> {n.severity}
          </span>
          <span className="ntf-tag cat">{n.category}</span>
          <span className="ntf-item-time">{timeAgo(n.timestamp)}</span>
        </div>
      </div>

      <div className="ntf-item-actions">
        {n.action && (
          <button
            className="ntf-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {n.action.label} <ChevronRight size={12} />
          </button>
        )}
        {!n.read && (
          <button
            className="ntf-mark-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead();
            }}
            aria-label="Mark as read"
          >
            <CheckCircle2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}