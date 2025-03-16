import React from "react";
import { FaCamera, FaFileAlt, FaDollarSign, FaChartBar } from "react-icons/fa";
import "../../styles/admin.css";

const Summary = () => {
  return (
    <div className="summary">
      <div className="box">
        <div className="box-content">
          <FaCamera className="box-icon" />
          <div>
            <h3>5 Leads</h3>
            <small>9 Closed Deals</small>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-content">
          <FaFileAlt className="box-icon" />
          <div>
            <h3>20</h3>
            <small>New Deals</small>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-content">
          <FaDollarSign className="box-icon" />
          <div>
            <h3>$20K</h3>
            <small>Est. Revenue</small>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-content">
          <FaChartBar className="box-icon" />
          <div>
            <h3>$10K</h3>
            <small>Est. Profit</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
