import React, { useState } from "react";

const ClientInteraction = () => {
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState([]);
  const [interactionRating, setInteractionRating] = useState("");

  // Editable date and time state
  const [interactionDate, setInteractionDate] = useState("");
  const [interactionTime, setInteractionTime] = useState("");

  const handleCheckboxChange = (value, stateSetter, stateValue) => {
    if (stateValue.includes(value)) {
      stateSetter(stateValue.filter((item) => item !== value));
    } else {
      stateSetter([...stateValue, value]);
    }
  };

  return (
    <div
      className="client-interaction-container"
      style={{
        width: '100%',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box'
      }}
    >
      <div className="add-interaction">
        <div className="interaction-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Editable Date & Time */}
          <div className="interaction-datetime">
  <h4>Interaction Schedule and Time</h4>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {/* Date Row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <label style={{ width: '60px', fontWeight: '600' }}>Date:</label>
      <input
        type="date"
        value={interactionDate}
        onChange={(e) => setInteractionDate(e.target.value)}
        style={{
          backgroundColor: '#f1f1f1',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#222',
          border: '1px solid #ccc',
          width: '160px'
        }}
      />
    </div>
    {/* Time Row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <label style={{ width: '60px', fontWeight: '600' }}>Time:</label>
      <input
        type="time"
        value={interactionTime}
        onChange={(e) => setInteractionTime(e.target.value)}
        style={{
          backgroundColor: '#f1f1f1',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#222',
          border: '1px solid #ccc',
          width: '160px'
        }}
      />
    </div>
  </div>
</div>

          {/* Connected Via */}
          <div className="connected-via">
            <h4>Connected Via</h4>
            <div className="radio-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {["call", "email", "call/email"].map((method) => (
                <label key={method} className="radio-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="radio"
                    name="contactMethod"
                    checked={contactMethod === method}
                    onChange={() => setContactMethod(method)}
                  />
                  <span className="radio-label">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Follow-Up Type */}
          <div className="follow-up-type">
            <h4>Follow-Up Type</h4>
            <div className="checkbox-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                "interested",
                "appointment",
                "no-response",
                "converted",
                "not-interested",
                "close"
              ].map((type) => (
                <label key={type} className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="checkbox"
                    checked={followUpType.includes(type)}
                    onChange={() =>
                      handleCheckboxChange(type, setFollowUpType, followUpType)
                    }
                  />
                  <span className="checkbox-label">{type.replace("-", " ")}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interaction Rating */}
          <div className="interaction-rating">
            <h4>Interaction Rating</h4>
            <div className="radio-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {["hot", "warm", "cold"].map((rating) => (
                <label key={rating} className="radio-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="radio"
                    name="interactionRating"
                    checked={interactionRating === rating}
                    onChange={() => setInteractionRating(rating)}
                  />
                  <span className="radio-label">{rating.charAt(0).toUpperCase() + rating.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientInteraction;
