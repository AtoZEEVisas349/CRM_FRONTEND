import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useApi } from "../../context/ApiContext";

const ClientOverview = () => {
  const { clientId } = useParams();
  const location = useLocation();

  const client = location.state?.client || {};
  const createFollowUpFlag = location.state?.createFollowUp || false;

  const {
    updateFreshLeadFollowUp,
    createFollowUp,
    followUpLoading,
    createMeetingAPI,
    fetchMeetings,
    fetchFreshLeads,
    refreshMeetings,
    executiveInfo,
    createFollowUpHistoryAPI, // Added createFollowUpHistoryAPI
  } = useApi();

  // Initialize date/time strings before state
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentTimeStr = now.toTimeString().slice(0, 5);

  // State hooks
  const [clientInfo, setClientInfo] = useState(client);
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState("");
  const [interactionRating, setInteractionRating] = useState("");
  const [reasonDesc, setReasonDesc] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interactionDate, setInteractionDate] = useState(todayStr);
  const [interactionTime, setInteractionTime] = useState(currentTimeStr);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);

  const minDate = useMemo(() => todayStr, []);
  const maxDate = useMemo(() => {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() + 5);
    return d.toISOString().split("T")[0];
  }, []);

  const minTime = interactionDate === minDate ? currentTimeStr : "00:00";

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

  const handleTextUpdate = async () => {
    if (!followUpType || !interactionDate || !interactionTime) {
      return alert("Please select a follow-up type, date and time before updating.");
    }

    const followUpId = clientInfo.followUpId || clientInfo.freshLeadId || clientInfo.id;
    if (!followUpId) {
      console.error("Missing follow-up ID on clientInfo:", clientInfo);
      return alert("Unable to find the record to update. Please reload and try again.");
    }
    try {
      if (followUpType === "appointment") {
        const meetingPayload = {
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          clientPhone: clientInfo.phone,
          reasonForFollowup: reasonDesc,
          startTime: new Date(`${interactionDate}T${interactionTime}`).toISOString(),
          endTime: null,
          fresh_lead_id: clientInfo.freshLeadId || clientInfo.id,
        };
        await createMeetingAPI(meetingPayload);
        alert("✅ Appointment created and lead moved to Meeting");
      
        await fetchFreshLeads();
        await fetchMeetings();
        await refreshMeetings();
      }
       else {
        const updatedData = {
          followUpStatus: followUpType,
          followUpDate: interactionDate,
        };

        await updateFreshLeadFollowUp(followUpId, updatedData);
        alert("✅ Follow-up status updated");

        await fetchFreshLeads();
      }

      setFollowUpType("");
      setInteractionDate("");
      setInteractionTime("");
      setReasonDesc("");
    } catch (error) {
      console.error("Error in handleTextUpdate:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  const handleCreateFollowUp = () => {
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
      connect_via: contactMethod,
      follow_up_type: followUpType,
      interaction_rating: interactionRating,
      reason_for_follow_up: reasonDesc,
      follow_up_date: interactionDate,
      follow_up_time: interactionTime,
      fresh_lead_id: clientInfo.freshLeadId || clientInfo.id,
    };
  
    createFollowUp(newFollowUpData)
      .then((response) => {
        // Log the full response to see its structure
        console.log("Full follow-up response:", response);
        
        // Try different paths to get the ID
        let followUpId = null;
        
        // Check various possible paths to the ID
        if (response && response.id) {
          followUpId = response.id;
        } else if (response && response.followUp && response.followUp.id) {
          followUpId = response.followUp.id;
        } else if (response && response.data && response.data.id) {
          followUpId = response.data.id;
        } else if (response && response.data && response.data.followUp && response.data.followUp.id) {
          followUpId = response.data.followUp.id;
        }
        
        console.log("Extracted follow-up ID:", followUpId);
        
        if (!followUpId) {
          console.error("Failed to get follow-up ID from response:", response);
          throw new Error("Missing follow-up ID in response");
        }
        
        // Create follow-up history with the same data but including the follow-up ID
        const followUpHistoryData = {
          follow_up_id: followUpId,
          connect_via: contactMethod,
          follow_up_type: followUpType,
          interaction_rating: interactionRating,
          reason_for_follow_up: reasonDesc,
          follow_up_date: interactionDate,
          follow_up_time: interactionTime,
          fresh_lead_id: clientInfo.freshLeadId || clientInfo.id,
        };
        
        console.log("Creating follow-up history with data:", followUpHistoryData);
        
        // Return the promise so we can chain then/catch
        return createFollowUpHistoryAPI(followUpHistoryData);
      })
      .then((historyResponse) => {
        console.log("Follow-up history created successfully:", historyResponse);
        alert("Follow-up and history created successfully!");
        
        // Reset form fields
        setReasonDesc("");
        setContactMethod("");
        setFollowUpType("");
        setInteractionRating("");
        setInteractionDate(todayStr);
        setInteractionTime(currentTimeStr);
      })
      .catch((error) => {
        console.error("Error creating Follow-up or history:", error);
        alert("Failed to create follow-up or history. Please try again.");
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

            <div className="follow-up-column">
              <div className="last-follow-up">
                <h3>Last Follow-up</h3>
                <p>{reasonDesc || "No follow-up text yet."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              {["interested", "appointment", "no response", "converted", "not interested", "close"].map((type) => (
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
                  {isListening ? "⏹" : "🎤"}
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
                      min={minDate}
                      max={maxDate}
                      onChange={(e) => setInteractionDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: "600" }}>Time:</label>
                    <input
                      type="time"
                      value={interactionTime}
                      min={minTime}
                      onChange={(e) => setInteractionTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="client-btn">
                <button className="update-btn" onClick={handleTextUpdate} disabled={followUpLoading}>
                  Update FreshLead
                </button>
                {createFollowUpFlag && (
                  <button className="create-btn" onClick={handleCreateFollowUp} disabled={followUpLoading}>
                    Create Follow-Up
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;
