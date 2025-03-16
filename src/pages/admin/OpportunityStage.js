import React from "react";
import circle from"../../assests/circle.png" // Ensure the image is inside assets folder

const OpportunityStage = () => {
  return (
    <div className="chart-container">
      <div className="chart">
        <h2>Opportunity Stage</h2>
        <img src={circle} alt="Donut Chart" className="chart-image" />
        <p>Total <b>150</b></p>
      </div>
      {/* Right-side hardcoded data */}
      <div className="chart-data">
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Leads:</b>
    </span>
    <span>120</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Proposals:</b>
    </span>
    <span>100</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Negotiation:</b>
    </span>
    <span>60</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Contracts Sent:</b>
    </span>
    <span>20</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Won:</b>
    </span>
    <span>20</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Lost:</b>
    </span>
    <span>20</span>
  </p>
</div>

    </div>
  );
};

export default OpportunityStage;
