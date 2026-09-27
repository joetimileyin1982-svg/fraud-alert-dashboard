import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ThreatItem from "./ThreatItem";
import ThreatDrawer from "./ThreatDrawer";
import { threatData } from "./ThreatData";
import "./ThreatIntelligence.css";

export default function ThreatIntelligence() {
  const [selectedThreat, setSelectedThreat] = useState(null);

  return (
    <div className="threatIntelligence">
      <div className="threatHeadingRow">
        <div className="threatHeadingLeft">
          <h3>Threat Intelligence</h3>
          <button disabled className="liveBtn">LIVE</button>
        </div>
        <Link to="/analyst/investigation" className="viewAllLink">
          <span>View all</span>
          <ArrowRight size={14} className="arrowIcon" />
        </Link>
      </div>

      <div className="threatList">
        {threatData.map((threat) => (
          <div key={threat.id} className="threatLink" onClick={() => setSelectedThreat(threat)}>
            <ThreatItem {...threat} />
          </div>
        ))}
      </div>

      <ThreatDrawer threat={selectedThreat} onClose={() => setSelectedThreat(null)} />
    </div>
  );
}