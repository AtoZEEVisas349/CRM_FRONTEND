import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useApi } from "../../context/ApiContext";

const ClientOverview = () => {
  const { clientId } = useParams();
  const location = useLocation();

  const client = location.state?.client || {};
  const createFollowUpFlag = location.state?.createFollowUp || false;  // Getting the flag from location state

  const {
    updateFollowUp,
    updateFreshLeadFollowUp,
    createFollowUpApi,
    followUpLoading,
  } = useApi();

  const [clientInfo, setClientInfo] = useState(client);
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState("");
  const [interactionRating, setInteractionRating] = useState("");
  const [reasonDesc, setReasonDesc] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interactionDate, setInteractionDate] = useState("");
  const [interactionTime, setInteractionTime] = useState("");

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);
  const clientFields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "altPhone", label: "Alt Phone" },
    { key: "education", label: "Education" },
    { key: "experience", label: "Experience" },
    { key: "state", label: "State" },
    { key: "dob", label: "Date of Birth" },
    { key: "country", label: "Country" },
    { key: "assignDate", label: "Assign Date" },
  ];

  useEffect(() => {
    if (client) setClientInfo(client);
  }, [client]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const handleChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextUpdate = () => {
    // Log clientInfo to check if freshLeadId is available
    console.log("Client Info:", clientInfo);
  
    // Prepare the data object to be sent for update
    const updatedData = {
      connect_via: contactMethod,
      follow_up_type: followUpType,
      interaction_rating: interactionRating,
      reason_for_follow_up: reasonDesc,
      follow_up_date: interactionDate,
      follow_up_time: interactionTime,
      fresh_lead_id: clientInfo.freshLeadId || clientInfo.id,  // Use freshLeadId or fallback to id
      leadId: clientInfo.leadId || clientInfo.freshLeadId || clientInfo.id,  // Ensure leadId is set properly
    };
  
    // Log the updated data to check what's being sent to the backend
    console.log("Updated Follow-up Data:", updatedData);
  
    // Ensure fresh_lead_id is not null
    if (!updatedData.fresh_lead_id) {
      console.error("fresh_lead_id is required!");
      alert("fresh_lead_id is required. Please ensure the lead is selected.");
      return;
    }
  
    // Ensure followUpId is available, fallback to freshLeadId or id
    const followUpId = clientInfo.followUpId || clientInfo.freshLeadId || clientInfo.id;
    console.log("Follow-up ID:", followUpId);  // Log to check if followUpId exists
  
    // If followUpId is still undefined, show an error
    if (!followUpId) {
      console.error("Follow-up ID is missing.");
      alert("Follow-up ID is missing. Please check the client data.");
      return;
    }
  
    // Call the appropriate API based on whether freshLeadId exists
    if (clientInfo.freshLeadId) {
      updateFreshLeadFollowUp(followUpId, updatedData)
        .then((response) => {
          console.log("Follow-up updated successfully:", response);
          alert("Follow-up updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating Follow-up:", error);
          alert("Failed to update follow-up.");
        });
    } else {
      updateFollowUp(followUpId, updatedData)
        .then((response) => {
          console.log("Follow-up updated successfully:", response);
          alert("Follow-up updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating Follow-up:", error);
          alert("Failed to update follow-up.");
        });
    }
  };  

  const handleCreateFollowUp = () => {
    // This function will be for creating a new follow-up
    if (
      !contactMethod ||
      !followUpType ||
      !interactionRating ||
      !reasonDesc ||
      !interactionDate ||
      !interactionTime
    ) {
      alert("Please fill out all required fields before creating follow-up.");
      return;
    }

    const newFollowUpData = {
      contactMethod,
      followUpType,
      interactionRating,
      reasonDesc,
      interactionDate,
      interactionTime,
    };

    const freshLeadId = clientInfo.freshLeadId || clientInfo.id;

    createFollowUpApi(freshLeadId, newFollowUpData)
      .then((response) => {
        console.log("Follow-up created successfully:", response);
        alert("Follow-up created!");
        setReasonDesc("");
        setContactMethod("");
        setFollowUpType("");
        setInteractionRating("");
        setInteractionDate("");
        setInteractionTime("");
      })
      .catch((error) => {
        console.error("Error creating Follow-up:", error);
        alert("Failed to create follow-up.");
      });
  };
  

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported");
    isListening ? stopListening() : recognitionRef.current.start();
    setIsListening(!isListening);
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  return (
    <div className="client-overview-wrapper">
      {/* Client Details */}
      <div className="c-container">
        <div className="c-header">
          <h2>Client Details</h2>
          <button className="c-button">×</button>
        </div>
        <div className="c-content">
          <div className="c-layout">
            <div className="client-info-column">
              <div className="c-profile">
                <div className="c-info">
                  {clientFields.map(({ key, label }) => (
                    <div className="info-item" key={key}>
                      <span className="label">{label} -</span>
                      <span
                        className="value"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange(key, e.target.innerText)}
                      >
                        {clientInfo[key] || ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow-Up Text Preview */}
            <div className="follow-up-column">
              <div className="last-follow-up">
                <h3>Last Follow-up</h3>
                <p>{reasonDesc || "No follow-up text yet."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Interaction */}
      <div className="client-interaction-container">
        <div className="interaction-form">
          <div className="connected-via">
            <h4>Connected Via</h4>
            <div className="radio-group">
              {["call", "email", "whatsapp"].map((method) => (
                <label key={method} className="radio-container">
                  <input
                    type="radio"
                    name="contactMethod"
                    checked={contactMethod === method}
                    onChange={() => setContactMethod(method)}
                  />
                  <span className="radio-label">
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="follow-up-type">
            <h4>Follow-Up Type</h4>
            <div className="radio-group">
              {[
                "interested",
                "appointment",
                "no-response",
                "converted",
                "not-interested",
                "close",
              ].map((type) => (
                <label key={type} className="radio-container">
                  <input
                    type="radio"
                    name="followUpType"
                    checked={followUpType === type}
                    onChange={() => setFollowUpType(type)}
                  />
                  <span className="radio-label">{type.replace("-", " ")}</span>
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
                  <span className="radio-label">
                    {rating.charAt(0).toUpperCase() + rating.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Follow-Up Detail */}
      <div className="followup-detail-theme">
        <div className="followup-detail-container">
          <h2>Follow-Up Details</h2>
          <div className="follow-up-reason">
            <h3>Reason for Follow-Up</h3>
            <div className="interaction-field">
              <label>Interaction Description:</label>
              <div className="textarea-with-speech">
                <textarea
                  value={reasonDesc}
                  onChange={(e) => setReasonDesc(e.target.value)}
                  className="interaction-textarea"
                  placeholder="Describe the follow-up reason..."
                />
                <button
                  type="button"
                  className={`speech-btn ${isListening ? "listening" : ""}`}
                  onClick={toggleListening}
                  aria-label={isListening ? "Stop recording" : "Start recording"}
                >
                  {isListening ? "⏹️" : "🎤"}
                </button>
              </div>

              <div className="interaction-datetime" style={{ marginTop: "20px" }}>
                <h4>Interaction Schedule and Time</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div>
                    <label style={{ fontWeight: "600" }}>Date:</label>
                    <input
                      type="date"
                      value={interactionDate}
                      onChange={(e) => setInteractionDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: "600" }}>Time:</label>
                    <input
                      type="time"
                      value={interactionTime}
                      onChange={(e) => setInteractionTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="button-group" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                {/* Only call createFollowUpApi when "Create Follow-Up" button is clicked */}
                <button
                  onClick={handleCreateFollowUp}
                  className="create-btn"
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Create Follow-Up
                </button>

                {/* Only call update API when "Update Follow-Up" button is clicked */}
                <button
                  onClick={handleTextUpdate}
                  className="update-btn"
                  style={{
                    backgroundColor: "#2196F3",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Update Follow-Up
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;
