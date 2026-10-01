import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Activity,
  Edit3,
  UserX,
  UserCheck,
} from "lucide-react";
import "./UserDrawer.css";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserDrawer({
  user: u,
  onClose,
  onEdit,
  onDeactivate,
  onReactivate,
}) {
  if (!u) return null;

  const isActive = u.status === "Active";
  const isSuspended = u.status === "Suspended";

  return (
    <div className="ud-backdrop" onClick={onClose}>
      <aside className="ud-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ud-head">
          <div className="ud-head-row">
            <div className="ud-avatar">{u.initials}</div>
            <div className="ud-head-text">
              <div className="ud-eyebrow">{u.id}</div>
              <h2 className="ud-title">{u.name}</h2>
              <div className="ud-sub">
                <span className={`ud-badge role-${u.role.toLowerCase()}`}>
                  {u.role}
                </span>
                <span className={`ud-badge status-${u.status.toLowerCase()}`}>
                  {u.status}
                </span>
              </div>
            </div>
          </div>
          <button className="ud-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="ud-body">
          <section className="ud-section">
            <h4>Contact</h4>
            <div className="ud-grid">
              <Info icon={<Mail size={12} />}   label="Email"    value={u.email} />
              <Info icon={<Phone size={12} />}  label="Phone"    value={u.phone} />
              <Info icon={<MapPin size={12} />} label="Location" value={u.location} />
              <Info icon={<Activity size={12} />} label="Department" value={u.department} />
            </div>
          </section>

          <section className="ud-section">
            <h4>Account</h4>
            <div className="ud-grid">
              <Info icon={<Calendar size={12} />} label="Joined" value={formatDate(u.joinedAt)} />
              <Info icon={<Clock size={12} />}    label="Last Login" value={formatDateTime(u.lastLogin)} />
              <Info icon={<Globe size={12} />}    label="Last IP"  value={u.lastIp || "—"} />
            </div>
          </section>

          {u.stats && (
            <section className="ud-section">
              <h4>Performance</h4>
              <div className="ud-stats">
                <div className="ud-stat">
                  <div className="ud-stat-value mono">{u.stats.investigations}</div>
                  <div className="ud-stat-label">Investigations</div>
                </div>
                <div className="ud-stat">
                  <div className="ud-stat-value mono">{u.stats.reviewed}</div>
                  <div className="ud-stat-label">Reviewed</div>
                </div>
                <div className="ud-stat">
                  <div className="ud-stat-value mono">{u.stats.escalated}</div>
                  <div className="ud-stat-label">Escalated</div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer actions */}
        <div className="ud-foot">
          <button className="ud-btn ud-btn-ghost" onClick={onEdit}>
            <Edit3 size={13} /> Edit
          </button>
          {isActive && (
            <button
              className="ud-btn ud-btn-danger"
              onClick={onDeactivate}
            >
              <UserX size={13} /> Suspend
            </button>
          )}
          {isSuspended && (
            <button
              className="ud-btn ud-btn-primary"
              onClick={onReactivate}
            >
              <UserCheck size={13} /> Reactivate
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div>
      <div className="ud-info-label">
        {icon}
        {label}
      </div>
      <div className="ud-info-value">{value}</div>
    </div>
  );
}