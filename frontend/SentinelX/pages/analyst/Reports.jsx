import { useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  Folder,
  Shield,
  Users,
  Cpu,
  Download,
  FileText,
  Clock,
  CheckCircle,
  Percent,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import {
  reportKpis,
  reportCatalog,
  recentReports,
  reportSummary,
} from "../../src/data/reports";
import "./styles/Reports.css";

const ICONS = {
  chart: BarChart3,
  bell: Bell,
  folder: Folder,
  shield: Shield,
  users: Users,
  cpu: Cpu,
};

export default function Reports() {
  const [selectedReportId, setSelectedReportId] = useState(reportCatalog[0].id);

  const selectedReport = useMemo(
    () => reportCatalog.find((r) => r.id === selectedReportId),
    [selectedReportId]
  );

  const summary = reportSummary[selectedReportId];

  return (
    <div className="rp-page">
      {/* ============ Header ============ */}
      <header className="rp-header">
        <div>
          <h1>Reports</h1>
          <p>Generate, view and export fraud investigation reports.</p>
        </div>
        <button className="rp-generate-btn">
          <Plus size={14} /> Generate Report
        </button>
      </header>

      {/* ============ KPI strip ============ */}
      <section className="rp-kpi-row">
        <KPI icon={FileText} label="Reports Generated" value={reportKpis.generated} tone="cyan" />
        <KPI icon={CheckCircle} label="Cases Resolved" value={reportKpis.resolved} tone="green" />
        <KPI icon={Clock} label="Avg Resolution" value={reportKpis.avgResolutionTime} tone="amber" />
        <KPI icon={Percent} label="False Positive Rate" value={reportKpis.falsePositiveRate} tone="pink" />
      </section>

      {/* ============ Main grid ============ */}
      <div className="rp-layout">
        {/* LEFT: catalog */}
        <div className="rp-col-main">
          <div className="rp-section-head">
            <h3>Report Library</h3>
            <span className="rp-section-sub">Choose a report to preview</span>
          </div>

          <div className="rp-catalog">
            {reportCatalog.map((r) => {
              const Icon = ICONS[r.icon] || FileText;
              const isActive = r.id === selectedReportId;
              return (
                <button
                  key={r.id}
                  className={`rp-catalog-card ${isActive ? "active" : ""} ${r.tone}`}
                  onClick={() => setSelectedReportId(r.id)}
                >
                  <div className="rp-catalog-icon">
                    <Icon size={18} />
                  </div>
                  <div className="rp-catalog-body">
                    <div className="rp-catalog-title">{r.title}</div>
                    <div className="rp-catalog-desc">{r.description}</div>
                    <div className="rp-catalog-meta">
                      <span className="rp-tag">{r.category}</span>
                      {r.format.map((f) => (
                        <span key={f} className="rp-tag rp-tag-format">{f}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight size={16} className="rp-catalog-arrow" />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: preview + recent */}
        <aside className="rp-col-side">
          {/* Preview */}
          {selectedReport && (
            <div className="rp-card rp-preview">
              <div className="rp-card-head">
                <h3>Preview</h3>
                <span className="rp-preview-id mono">{selectedReport.id}</span>
              </div>

              <div className="rp-preview-title">
                {selectedReport.title}
              </div>
              <div className="rp-preview-desc">
                {selectedReport.description}
              </div>

              {summary && (
                <>
                  <div className="rp-preview-subhead">Includes</div>
                  <ul className="rp-preview-list">
                    {summary.sections.map((s, i) => (
                      <li key={i}>
                        <CheckCircle size={12} /> {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="rp-preview-actions">
                <button className="rp-btn rp-btn-primary">
                  <Download size={13} /> Download PDF
                </button>
                <button className="rp-btn rp-btn-ghost">
                  <Download size={13} /> CSV
                </button>
              </div>
            </div>
          )}

          {/* Recent reports */}
          <div className="rp-card rp-recent">
            <div className="rp-card-head">
              <h3>Recent Reports</h3>
              <button className="rp-link">View all</button>
            </div>

            <ul className="rp-recent-list">
              {recentReports.map((r) => (
                <li key={r.id} className="rp-recent-item">
                  <div className="rp-recent-icon">
                    <FileText size={14} />
                  </div>
                  <div className="rp-recent-body">
                    <div className="rp-recent-title">{r.title}</div>
                    <div className="rp-recent-meta">
                      <span className="mono">{r.id}</span>
                      <span>·</span>
                      <span>{r.format}</span>
                      <span>·</span>
                      <span>{r.size}</span>
                    </div>
                    <div className="rp-recent-by">
                      {r.generatedBy} · {r.generatedAt}
                    </div>
                  </div>
                  <button className="rp-recent-dl" aria-label="Download">
                    <Download size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============ KPI ============ */
function KPI({ icon: Icon, label, value, tone }) {
  return (
    <div className={`rp-kpi ${tone}`}>
      <div className="rp-kpi-icon">
        <Icon size={18} />
      </div>
      <div className="rp-kpi-body">
        <div className="rp-kpi-label">{label}</div>
        <div className="rp-kpi-value mono">{value}</div>
      </div>
    </div>
  );
}