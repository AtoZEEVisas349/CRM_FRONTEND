import React, { useState } from "react";

const FollowUpDetail = () => {
  // ✅ Define reasonDesc with useState
  const [reasonDesc, setReasonDesc] = useState("");

  return (
    <div>
      <h2>Follow-Up Details</h2>

      <div className="follow-up-reason">
        <h3>Reason for Follow-Up</h3>
        <div className="interaction-field">
          <label>Interaction Description:</label>
          <textarea
            value={reasonDesc} 
            onChange={(e) => setReasonDesc(e.target.value)} 
            className="interaction-textarea"
          />
        </div>
      </div>

      <div className="follow-up-datetime">
        <h3>Follow-Up Date and Time</h3>
        <div className="datetime-container">
          <div className="date-field">
            <p className="label">Date:</p>
            <p className="value">10-03-2024</p>
          </div>
          <br />
          <div className="time-field">
            <p className="label">Time:</p>
            <p className="value">11:30PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpDetail;
