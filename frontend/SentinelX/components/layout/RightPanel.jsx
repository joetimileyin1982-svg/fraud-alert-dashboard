import ThreatIntelligence from "../analyst/investigation/ThreatIntelligence";
import "./RightPanel.css";

export default function RightPanel() {
  return (
    <aside className="rightPanel">
      <ThreatIntelligence />
    </aside>
  );
}