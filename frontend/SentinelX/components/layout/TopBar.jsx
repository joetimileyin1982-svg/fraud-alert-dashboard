import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { adminNotifications } from "../../src/data/adminNotifications";
import { analystNotifications } from "../../src/data/analystNotifications";
import "./TopBar.css";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

const ROLE_SUBTITLE = {
  Administrator:
    "Manage SentinelX operations, users, fraud rules, and system activity.",
  "Fraud Analyst":
    "Monitor, investigate and stop fraud in real time.",
};

const SEVERITY_TONE = {
  critical: "critical",
  warning: "warning",
  info: "info",
  success: "success",
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

export default function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const profileRef = useRef(null);
  const bellRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setBellOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Pick the right notification list based on role, sorted newest first
  const notifications = useMemo(() => {
    if (!user) return [];
    const source =
      user.role === "Administrator" ? adminNotifications : analystNotifications;
    return [...source].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [user]);

  // Unread count for the badge dot (simple: uses the data file's `read` field)
  const hasUnread = useMemo(
    () => notifications.some((n) => !n.read),
    [notifications]
  );

  if (!user) return null;

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user.initials || user.name.slice(0, 2).toUpperCase();

  const notificationsPath =
    user.role === "Administrator"
      ? "/admin/notifications"
      : "/analyst/notifications";

  const recent = notifications.slice(0, 5);

  const handleNotificationClick = (n) => {
    setBellOpen(false);
    if (n.action?.to) navigate(n.action.to);
    else navigate(notificationsPath);
  };

  return (
    <div className="topBar">
      {/* ============ Row 1 ============ */}
      <div className="topBarRow">
        <div className="searchWrap">
          <Search size={16} className="searchIcon" />
          <input
            type="text"
            placeholder="Search customers, transactions, device IDs..."
            className="searchInput"
          />
          <kbd className="searchKbd">⌘K</kbd>
        </div>

        <div className="topBarActions">
          {/* ---- Bell ---- */}
          <div className="bellWrapOuter" ref={bellRef}>
            <button
              className="bellWrap"
              aria-label="Notifications"
              onClick={() => setBellOpen((v) => !v)}
            >
              <Bell size={18} />
              {hasUnread && <span className="bellDot" />}
            </button>

            {bellOpen && (
              <div className="bellMenu">
                <div className="bellMenuHead">
                  <span className="bellMenuTitle">Notifications</span>
                </div>

                <div className="bellMenuList">
                  {recent.length === 0 ? (
                    <div className="bellMenuEmpty">No notifications yet.</div>
                  ) : (
                    recent.map((n) => (
                      <button
                        key={n.id}
                        className="bellItem"
                        onClick={() => handleNotificationClick(n)}
                        type="button"
                      >
                        <span
                          className={`bellItemDot ${
                            SEVERITY_TONE[n.severity] || "info"
                          }`}
                        />
                        <span className="bellItemBody">
                          <span className="bellItemTitle">{n.title}</span>
                          <span className="bellItemMeta">
                            {n.category} · {timeAgo(n.timestamp)}
                          </span>
                        </span>
                      </button>
                    ))
                  )}
                </div>

                <button
                  className="bellMenuViewAll"
                  onClick={() => {
                    setBellOpen(false);
                    navigate(notificationsPath);
                  }}
                  type="button"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>

          {/* ---- Profile ---- */}
          <div className="profileWrap" ref={profileRef}>
            <button
              className="profileSec"
              onClick={() => setProfileOpen((v) => !v)}
              aria-expanded={profileOpen}
            >
              <div className="avatarWrap">
                <div className="avatar">{initials}</div>
                <span className="statusRing" />
              </div>
              <div className="profileText">
                <p className="profileName">{user.name}</p>
                <p className="profileRole">{user.role}</p>
              </div>
              <ChevronDown
                size={14}
                className={`profileChevron ${profileOpen ? "open" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="profileMenu">
                <div className="menuHeader">
                  <div className="avatarWrap">
                    <div className="avatar">{initials}</div>
                  </div>
                  <div>
                    <div className="menuHeaderName">{user.name}</div>
                    <div className="menuHeaderEmail">{user.email}</div>
                  </div>
                </div>
                <div className="menuDivider" />

                <button className="menuItem" type="button">
                  <User size={14} /> Profile
                </button>
                <button className="menuItem" type="button">
                  <Settings size={14} /> Settings
                </button>

                <div className="menuDivider" />

                <button
                  className="menuItem menuItemDanger"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ Row 2 ============ */}
      <div className="greeting">
        <h2 className="greetingTitle">
          {getGreeting()},{" "}
          <span className="greetingName">{user.name.split(" ")[0]}</span>
        </h2>
        <p className="greetingSub">
          {ROLE_SUBTITLE[user.role] || "Welcome to SentinelX."}
        </p>
      </div>
    </div>
  );
}