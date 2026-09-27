import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ThreatItem from "./ThreatItem";
import ThreatDrawer from "./ThreatDrawer";
import { alertsData } from "./AlertsData";
import "./ThreatIntelligence.css";

export default function ThreatIntelligence() {
  const [selectedThreat, setSelectedThreat] = useState(null);

  return (
    <div className="threatIntelligence">
      <div className="threatHeadingRow">
        <h3 className="threatMainTitle">Threat Intelligence</h3>
        <Link to="/analyst/investigation" className="viewAllLink">
          <span>View all</span>
          <ArrowRight size={13} />
        </Link>
      </div>
      <button disabled className="liveBtn">LIVE</button>

      <div className="threatPanel">
        <div className="threatList">
          {alertsData.map((threat) => (
            <div key={threat.id} className="threatLink" onClick={() => setSelectedThreat(threat)}>
              <ThreatItem {...threat} />
            </div>
          ))}
        </div>
      </div>

      <ThreatDrawer threat={selectedThreat} onClose={() => setSelectedThreat(null)} />
    </div>
  );
}