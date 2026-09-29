import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ShieldAlert,
  Search,
  ArrowLeft,
  User,
  CreditCard,
  Clock,
  Cpu,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Send,
  MessageSquare,
  FileText,
} from "lucide-react";
import { alertsData } from "../../src/data/AlertsData";
import { formatCurrency } from "../../src/utils/format";
import "../../styles/Investigation.css";

export default function Investigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const incomingTxn = searchParams.get("txn");
  const incomingAlert = searchParams.get("alert");
  const incomingCust = searchParams.get("customer");

  const initialCaseId =
    id ||
    incomingAlert ||
    incomingTxn ||
    incomingCust ||
    alertsData[0]?.id;

  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("timeline");
  const [activityLog, setActivityLog] = useState([
    {
      id: 1,
      text: "System flagged high risk transaction.",
      time: "08:42 AM",
      author: "Automated Bot",
    },
    {
      id: 2,
      text: "Assigned to Fraud Analyst Daisy H.",
      time: "08:45 AM",
      author: "System Routing",
    },
  ]);

  // Sync selected case when URL changes
  useEffect(() => {
    const next =
      id || incomingAlert || incomingTxn || incomingCust;
    if (next && next !== selectedCaseId) {
      setSelectedCaseId(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, incomingAlert, incomingTxn, incomingCust]);

  // Esc key navigates back
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // Empty state if no data
  if (!alertsData || alertsData.length === 0) {
    return (
      <div className="investigationContainer">
        <div className="emptyState">
          <ShieldAlert size={28} />
          <p>No investigations to display.</p>
        </div>
      </div>
    );
  }

  const activeCase =
    alertsData.find((item) => item.id === selectedCaseId) || alertsData[0];

  const nowTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setActivityLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: notes.trim(),
        time: nowTime(),
        author: "Daisy H.",
      },
    ]);
    setNotes("");
  };

  const handleAction = (action) => {
    setActivityLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `Case marked as ${action}.`,
        time: nowTime(),
        author: "Daisy H.",
      },
    ]);
    setActiveTab("notes");
  };

  const filteredQueue = alertsData.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q);

    if (statusFilter === "All") return matchesSearch;
    return (
      matchesSearch &&
      item.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  });

  return (
    <div className="investigationContainer">
      {/* ============ Top Bar ============ */}
      <header className="investigationHeader">
        <div className="headerLeft">
          <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <div className="headerTitleGroup">
            <h1 className="pageTitle">Fraud Case Investigation</h1>
            <span className="caseIdTag mono">
              ID: {activeCase?.id?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="headerActions">
          <button
            className="actionBtn approve"
            onClick={() => handleAction("Legitimate")}
          >
            <CheckCircle size={14} /> Mark Legitimate
          </button>
          <button
            className="actionBtn escalate"
            onClick={() => handleAction("Escalated")}
          >
            <AlertTriangle size={14} /> Escalate Case
          </button>
          <button
            className="actionBtn block"
            onClick={() => handleAction("Account Blocked")}
          >
            <XCircle size={14} /> Block Account
          </button>
        </div>
      </header>

      {/* ============ Main 2-column layout ============ */}
      <div className="investigationGrid">
        {/* LEFT: Queue */}
        <aside className="queueSidebar">
          <div className="queueSearchBox">
            <Search size={13} className="searchIcon" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="queueFilterTabs">
            {["All", "New", "In Review", "Resolved"].map((status) => (
              <button
                key={status}
                className={`filterTab ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="queueList">
            {filteredQueue.length === 0 ? (
              <div className="emptyQueue">No cases match your filters.</div>
            ) : (
              filteredQueue.map((item) => (
                <div
                  key={item.id}
                  className={`queueCard ${
                    selectedCaseId === item.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCaseId(item.id)}
                >
                  <div className="queueCardHeader">
                    <span className="queueTitle">{item.title}</span>
                    <span
                      className={`queueBadge ${item.severity?.toLowerCase()}`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <div className="queueSub">{item.subtitle}</div>
                  <div className="queueFooter">
                    <span className="queueTime">{item.time}</span>
                    <span className="queueStatus">{item.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* RIGHT: Workspace */}
        <main className="caseDetailPanel">
          {/* 1. Risk Overview */}
          <section className="riskSummaryCard">
            <div className="riskScoreGauge">
              <div
                className="scoreCircle"
                style={{ borderColor: activeCase?.color || "#ef4444" }}
              >
                <span className="scoreVal mono">
                  {activeCase?.transaction?.risk || 82}
                </span>
                <span className="scoreLbl">Risk Index</span>
              </div>
            </div>

            <div className="riskMeta">
              <h2 className="caseMainTitle">{activeCase?.title}</h2>
              <p className="caseDescription">
                {activeCase?.description ||
                  "Unusual location + high transaction volume."}
              </p>
              <div className="metaPills">
                <span className="pill">
                  <Clock size={12} /> {activeCase?.time}
                </span>
                <span className="pill">
                  <ShieldAlert size={12} /> Rule:{" "}
                  {activeCase?.rule || "High Risk"}
                </span>
                <span className="pill">
                  <Cpu size={12} /> Type: {activeCase?.type || "Transaction"}
                </span>
              </div>
            </div>
          </section>

          {/* 2. Entity details */}
          <section className="detailsGrid">
            <div className="infoCard">
              <div className="cardHeader">
                <User size={15} className="cardIcon" />
                <h3>Customer Information</h3>
              </div>
              <div className="infoRows">
                <div className="infoRow">
                  <span>Name:</span>{" "}
                  <strong>
                    {activeCase?.transaction?.customer || "Luna Bloom"}
                  </strong>
                </div>
                <div className="infoRow">
                  <span>Location:</span>{" "}
                  <strong>
                    {activeCase?.transaction?.location || "Lagos, NG"}
                  </strong>
                </div>
                <div className="infoRow">
                  <span>Status:</span>{" "}
                  <strong className="statusActive">Flagged</strong>
                </div>
              </div>
            </div>

            <div className="infoCard">
              <div className="cardHeader">
                <CreditCard size={15} className="cardIcon" />
                <h3>Transaction Details</h3>
              </div>
              <div className="infoRows">
                <div className="infoRow">
                  <span>Amount:</span>{" "}
                  <strong className="highlightAmount mono">
                    {typeof activeCase?.transaction?.amount === "number"
                      ? formatCurrency(activeCase.transaction.amount)
                      : activeCase?.transaction?.amount || "₦450,000"}
                  </strong>
                </div>
                <div className="infoRow">
                  <span>Merchant:</span>{" "}
                  <strong>
                    {activeCase?.transaction?.merchant || "Krusty Mart"}
                  </strong>
                </div>
                <div className="infoRow">
                  <span>Channel:</span> <strong>Mobile App</strong>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Tabbed workspace */}
          <section className="workspaceTabCard">
            <div className="tabHeader">
              <button
                className={`tabBtn ${
                  activeTab === "timeline" ? "active" : ""
                }`}
                onClick={() => setActiveTab("timeline")}
              >
                <TrendingUp size={14} /> Behavioral Timeline
              </button>
              <button
                className={`tabBtn ${
                  activeTab === "notes" ? "active" : ""
                }`}
                onClick={() => setActiveTab("notes")}
              >
                <MessageSquare size={14} /> Analyst Audit Notes (
                {activityLog.length})
              </button>
            </div>

            <div className="tabBody">
              {activeTab === "timeline" ? (
                <div className="timelineStream">
                  <div className="timelineItem">
                    <div className="marker blue"></div>
                    <div className="timelineContent">
                      <span className="time">08:30 AM</span>
                      <p>User logged in from new device IP (197.210.x.x)</p>
                    </div>
                  </div>

                  <div className="timelineItem">
                    <div className="marker yellow"></div>
                    <div className="timelineContent">
                      <span className="time">08:35 AM</span>
                      <p>
                        Password change requested and completed via SMS OTP
                      </p>
                    </div>
                  </div>

                  <div className="timelineItem">
                    <div className="marker red"></div>
                    <div className="timelineContent">
                      <span className="time">08:42 AM</span>
                      <p>
                        High-value fund transfer initiated (
                        {typeof activeCase?.transaction?.amount === "number"
                          ? formatCurrency(activeCase.transaction.amount)
                          : activeCase?.transaction?.amount || "₦450,000"}
                        )
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="notesWorkspace">
                  <div className="activityLog">
                    {activityLog.map((log) => (
                      <div key={log.id} className="logEntry">
                        <div className="logMeta">
                          <span className="author">{log.author}</span>
                          <span className="time mono">{log.time}</span>
                        </div>
                        <p className="logText">{log.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddNote} className="noteInputForm">
                    <input
                      type="text"
                      placeholder="Add investigation findings or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <button type="submit" className="sendNoteBtn">
                      <Send size={12} /> Post Note
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}