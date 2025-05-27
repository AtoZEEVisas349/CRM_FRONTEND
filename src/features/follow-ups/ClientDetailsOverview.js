import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import Swal from "sweetalert2";

function convertTo24HrFormat(timeStr) {
  const dateObj = new Date(`1970-01-01 ${timeStr}`);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}:00`;
}

const ClientDetailsOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const {
    followUpHistories,
    fetchFollowUpHistoriesAPI,
    updateFollowUp,
    createConvertedClientAPI,
    createCloseLeadAPI,
    createMeetingAPI,
    fetchFreshLeadsAPI,
    fetchMeetings,
    refreshMeetings,
    followUpLoading,
    createFollowUpHistoryAPI,
  } = useApi();

  const client = location.state?.client || {};

  const [clientInfo, setClientInfo] = useState(client);
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState("");
  const [interactionRating, setInteractionRating] = useState("");
  const [reasonDesc, setReasonDesc] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interactionDate, setInteractionDate] = useState("");
  const now = new Date();
  const defaultTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const [interactionTime, setInteractionTime] = useState(defaultTime);
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    console.log("FollowUp Type Changed:", followUpType);
  }, [followUpType]);

  const clientFields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "altPhone", label: "Alt Phone" },
    { key: "education", label: "Education" },
    { key: "experience", label: "Experience" },
    { key: "state", label: "State" },
    { key: "dob", label: "DOB" },
    { key: "country", label: "Country" },
    { key: "assignDate", label: "Assign Date" },
  ];

  useEffect(() => {
    if (client) {
      const freshLeadId =
        client.freshLead?.id || client.fresh_lead_id || client.id;
      const normalizedClient = {
        ...client,
        fresh_lead_id: freshLeadId,
        followUpId: client.followUpId || client.id,
      };
      setClientInfo(normalizedClient);
      loadFollowUpHistories(freshLeadId);
    }
  }, [client]);

  const loadFollowUpHistories = async (freshLeadId) => {
    if (!freshLeadId) return;
    setIsLoading(true);
    try {
      const response = await fetchFollowUpHistoriesAPI();
      if (Array.isArray(response)) {
        const filteredHistories = response.filter(
          (history) => history.fresh_lead_id === freshLeadId
        );
        filteredHistories.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setHistories(filteredHistories);
        if (filteredHistories.length > 0) {
          populateFormWithHistory(filteredHistories[0]);
        } else {
          setHistories([]);
        }
      } else {
        setHistories([]);
      }
    } catch (error) {
      console.error("Error fetching follow-up histories:", error);
      setHistories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const populateFormWithHistory = (history) => {
    setContactMethod(history.connect_via?.toLowerCase() || "");
    setFollowUpType(history.follow_up_type || "");
    setInteractionRating(history.interaction_rating?.toLowerCase() || "");
    setReasonDesc(history.reason_for_follow_up || "");
    setInteractionDate(history.follow_up_date || "");
    setInteractionTime(history.follow_up_time || "");
  };

  const handleChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateFollowUpDetails = async (freshLeadId, followUpId) => {
    const updatePayload = {
      connect_via: capitalize(contactMethod),
      follow_up_type: followUpType,
      interaction_rating: capitalize(interactionRating),
      reason_for_follow_up: reasonDesc,
      follow_up_date: interactionDate,
      follow_up_time: convertTo24HrFormat(interactionTime),
      fresh_lead_id: freshLeadId,
    };

    await updateFollowUp(followUpId, updatePayload);

    // Create a new FollowUpHistory entry to reflect the updated details
    await createFollowUpHistoryAPI({
      follow_up_id: followUpId,
      connect_via: capitalize(contactMethod),
      follow_up_type: followUpType,
      interaction_rating: capitalize(interactionRating),
      reason_for_follow_up: reasonDesc,
      follow_up_date: interactionDate,
      follow_up_time: convertTo24HrFormat(interactionTime),
      fresh_lead_id: freshLeadId,
    });
  };

  const handleUpdateFollowUp = async () => {
    const freshLeadId =
      clientInfo.fresh_lead_id || clientInfo.freshLeadId || clientInfo.id;

    if (!freshLeadId) {
      return Swal.fire({
        icon: "error",
        title: "Missing Lead ID",
        text: "Unable to find the lead. Please reload and try again.",
      });
    }

    try {
      const followUpId = clientInfo.followUpId || clientInfo.id;

      // Update follow-up details and create history entry
      await updateFollowUpDetails(freshLeadId, followUpId);

      Swal.fire({ icon: "success", title: "Follow-Up Updated" });

      // Refresh data and navigate
      await fetchFreshLeadsAPI();
      await fetchMeetings();
      await refreshMeetings();
      loadFollowUpHistories(freshLeadId);
      setTimeout(() => navigate("/follow-up"), 1000);
    } catch (err) {
      console.error("Follow-Up Update Error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleCreateMeeting = async () => {
    const freshLeadId =
      clientInfo.fresh_lead_id || clientInfo.freshLeadId || clientInfo.id;

    if (!freshLeadId) {
      return Swal.fire({
        icon: "error",
        title: "Missing Lead ID",
        text: "Unable to find the lead. Please reload and try again.",
      });
    }

    if (!reasonDesc) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Reason",
        text: "Please add a reason before creating a meeting.",
      });
    }

    try {
      const followUpId = clientInfo.followUpId || clientInfo.id;

      // First, update follow-up details and create history entry
      await updateFollowUpDetails(freshLeadId, followUpId);

      // Then, schedule the meeting
      const meetingPayload = {
        clientName: clientInfo.name,
        clientEmail: clientInfo.email,
        clientPhone: clientInfo.phone,
        reasonForFollowup: reasonDesc,
        startTime: new Date(
          `${interactionDate || new Date().toISOString().split("T")[0]}T${convertTo24HrFormat(interactionTime)}`
        ).toISOString(),
        endTime: null,
        fresh_lead_id: freshLeadId,
      };
      await createMeetingAPI(meetingPayload);

      Swal.fire({ icon: "success", title: "Meeting Created" });

      // Refresh data and navigate
      await fetchFreshLeadsAPI();
      await fetchMeetings();
      await refreshMeetings();
      loadFollowUpHistories(freshLeadId);
      setTimeout(() => navigate("/follow-up"), 1000);
    } catch (err) {
      console.error("Meeting Creation Error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleFollowUpAction = async () => {
    const freshLeadId =
      clientInfo.fresh_lead_id || clientInfo.freshLeadId || clientInfo.id;

    if (!freshLeadId) {
      return Swal.fire({
        icon: "error",
        title: "Missing Lead ID",
        text: "Unable to find the lead. Please reload and try again.",
      });
    }

    try {
      if (followUpType === "converted") {
        await createConvertedClientAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Client Converted" });
      } else if (followUpType === "close") {
        await createCloseLeadAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Lead Closed" });
      } else {
        return; // Do nothing for other types; handled by specific buttons
      }

      await fetchFreshLeadsAPI();
      await fetchMeetings();
      await refreshMeetings();
      loadFollowUpHistories(freshLeadId);
      setTimeout(() => navigate("/follow-up"), 1000);
    } catch (err) {
      console.error("Follow-up Action Error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
      });
    }
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
                      <span className="label">{label}:</span>
                      <input
                        type="text"
                        className="client-input"
                        value={clientInfo[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="follow-up-column">
              <div className="last-follow-up">
                <h3>Last Follow-up</h3>
                {isLoading ? (
                  <p>Loading follow-up history...</p>
                ) : histories.length > 0 ? (
                  <div>
                    <p>
                        {new Date(histories[0].follow_up_date).toLocaleDateString()} -{" "}
                        {histories[0].follow_up_time}
                    </p>
                    <p>{histories[0].reason_for_follow_up || "No description available."}</p>
                  </div>
                ) : (
                  <p>No follow-up history available.</p>
                )}
              </div>

              {histories.length > 0 && (
                <div className="follow-up-history-summary">
                  <div className="history-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {histories.slice(1).map((history, index) => (
                      <div key={index} className="history-item" style={{ marginBottom: "10px", padding: "5px", borderBottom: "1px solid #eee" }}>
                        <p>{new Date(history.follow_up_date).toLocaleDateString()} - {history.follow_up_time}</p>
                        <p>{history.reason_for_follow_up}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                "no response",
                "converted",
                "not interested",
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
          <div className="follow-up-reason">
            <h3>Reason for Follow-Up</h3>
            <div className="interaction-field">
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
                    <label style={{ fontWeight: "400" }}>Date:</label>
                    <input
                      type="date"
                      value={interactionDate}
                      onChange={(e) => setInteractionDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: "400" }}>Time:</label>
                    <TimePicker
                      onChange={setInteractionTime}
                      value={interactionTime}
                      format="hh:mm a"
                      disableClock={true}
                      clearIcon={null}
                    />
                  </div>
                </div>
              </div>

              <div className="button-group" style={{ marginTop: "20px" }}>
                {/* Update Follow-Up button */}
                <button
                  onClick={handleUpdateFollowUp}
                  className="crm-button update-follow-btn"
                  disabled={followUpLoading}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: followUpLoading ? "not-allowed" : "pointer",
                    opacity: followUpLoading ? 0.6 : 1,
                  }}
                >
                  {followUpLoading ? "Processing..." : "Update Follow-Up"}
                </button>

                {/* Show these based on follow-up type */}
                {followUpType === "converted" && (
                  <button
                    onClick={handleFollowUpAction}
                    className="crm-button converted-btn"
                    disabled={followUpLoading}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "10px 20px",
                      marginLeft: "10px",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  >
                    Create Converted
                  </button>
                )}

                {followUpType === "close" && (
                  <button
                    onClick={handleFollowUpAction}
                    className="crm-button close-btn"
                    disabled={followUpLoading}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      padding: "10px 20px",
                      marginLeft: "10px",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  >
                    Create Close
                  </button>
                )}

                {followUpType === "appointment" && (
                  <button
                    onClick={handleCreateMeeting}
                    className="crm-button meeting-btn"
                    disabled={followUpLoading}
                    style={{
                      backgroundColor: "#17a2b8",
                      color: "white",
                      padding: "10px 20px",
                      marginLeft: "10px",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  >
                    Create Meeting
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

export default ClientDetailsOverview;