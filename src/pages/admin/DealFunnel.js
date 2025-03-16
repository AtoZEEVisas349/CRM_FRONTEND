import React from "react";
import traingle from"../../assests/traingle.png" // Ensure the image is inside assets folder

const DealFunnel = () => {
  return (
    <div className="chart-container">
      <div className="chart">
        <h2>Deal Funnel</h2>
        <img src={traingle} alt="Deal Funnel" className="chart-image" />
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
      <span className="dot"></span><b>Sales Calls:</b>
    </span>
    <span>100</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Follow-up:</b>
    </span>
    <span>60</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Conversion:</b>
    </span>
    <span>20</span>
  </p>
  <p>
    <span className="chart-label">
      <span className="dot"></span><b>Sale:</b>
    </span>
    <span>15</span>
  </p>
</div>

    </div>
  );
};

export default DealFunnel;
