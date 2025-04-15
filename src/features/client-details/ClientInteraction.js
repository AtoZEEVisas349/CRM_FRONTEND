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
    <div className="client-interaction-container">
      <div className="add-interaction">
        <h3>Add Interaction</h3>
        <div className="interaction-form">
          
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

          <div className="connected-via">
            <h4>Connected Via</h4>
            <div className="radio-group">
              {["call", "email", "call/email"].map((method) => (
                <label key={method} className="radio-container">
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

          <div className="follow-up-type">
            <h4>Follow-Up Type</h4>
            <div className="checkbox-group">
              {["interested", "appointment", "no-response", "converted", "not-interested", "close"].map((type) => (
                <label key={type} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={followUpType.includes(type)}
                    onChange={() => handleCheckboxChange(type, setFollowUpType, followUpType)}
                  />
                  <span className="checkbox-label">{type.replace("-", " ")}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="interaction-rating">
            <h4>Interaction Rating</h4>
            <div className="radio-group">
              {["hot", "warm", "cold"].map((rating) => (
                <label key={rating} className="radio-container">
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
