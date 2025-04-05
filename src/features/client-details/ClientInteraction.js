import React, { useState } from "react";

const ClientInteraction = () => {
  // State Variables
  const [interactionDesc, setInteractionDesc] = useState("");
  const [contactMethod, setContactMethod] = useState(""); // Single selection
  const [followUpType, setFollowUpType] = useState([]); // Multiple selections
  const [interactionRating, setInteractionRating] = useState(""); // Single selection

  // Handle Checkbox Toggle for Multiple Selection
  const handleCheckboxChange = (value, stateSetter, stateValue) => {
    if (stateValue.includes(value)) {
      stateSetter(stateValue.filter((item) => item !== value));
    } else {
      stateSetter([...stateValue, value]);
    }
  };

  return (
    <div>
      <div className="add-interaction">
        <h3>Add Interaction</h3>
        <div className="interaction-field">
          <label>Interaction Description:</label>
          <textarea
            value={interactionDesc}
            onChange={(e) => setInteractionDesc(e.target.value)}
            className="interaction-textarea"
          />
        </div>

        {/* Connected Via Section */}
        <div className="connected-via">
          <h4>Connected Via</h4>
          <div className="checkbox-group">
            {["call", "email", "call/email"].map((method) => (
              <label key={method} className="checkbox-container">
                <input
                  type="radio"
                  checked={contactMethod === method}
                  onChange={() => setContactMethod(method)}
                />
                <span className="checkbox-label">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Follow-Up Type */}
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

        {/* Interaction Rating */}
        <div className="interaction-rating">
          <h4>Interaction Rating</h4>
          <div className="checkbox-group">
            {["hot", "warm", "cold"].map((rating) => (
              <label key={rating} className="checkbox-container">
                <input
                  type="radio"
                  checked={interactionRating === rating}
                  onChange={() => setInteractionRating(rating)}
                />
                <span className="checkbox-label">{rating.charAt(0).toUpperCase() + rating.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInteraction;
