import React, { useState } from "react";

const ClientInteraction = () => {
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState([]);
  const [interactionRating, setInteractionRating] = useState("");

  // Editable date and time state
  

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
        <div className="interaction-form">
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
