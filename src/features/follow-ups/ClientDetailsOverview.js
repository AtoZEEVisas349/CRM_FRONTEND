import React, { useState, useEffect, useRef,useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext";
import { getEmailTemplates } from "../../static/emailTemplates"; 
import Swal from "sweetalert2";
import useCopyNotification from "../../hooks/useCopyNotification";

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
    executiveInfo,
    fetchNotifications,
    createCopyNotification,
  } = useApi();

  useCopyNotification(createCopyNotification, fetchNotifications);
  const client = useMemo(() => location.state?.client || {}, []);
  
  // Initialize current time properly
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const ampmValue = currentHour >= 12 ? "PM" : "AM";
  const hour12 = currentHour % 12 || 12;
  const currentTime12Hour = `${hour12.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

  const [clientInfo, setClientInfo] = useState(client);
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState("");
  const [interactionRating, setInteractionRating] = useState("");
  const [reasonDesc, setReasonDesc] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interactionDate, setInteractionDate] = useState(todayStr);
  const [timeOnly, setTimeOnly] = useState(currentTime12Hour);
  const [ampm, setAmPm] = useState(ampmValue);
  const [isTimeEditable, setIsTimeEditable] = useState(false);

  // Add time conversion functions
  const convertTo24Hour = (time12h, amPm) => {
    let [hours, minutes] = time12h.split(':').map(Number);
    if (amPm === 'PM' && hours !== 12) hours += 12;
    if (amPm === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const convertTo12Hour = (time24h) => {
    let [hours, minutes] = time24h.split(':').map(Number);
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return {
      time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      amPm: amPm
    };
  };

  const interactionTime = useMemo(() => {
    let [hr, min] = timeOnly.split(":").map(Number);
    if (ampm === "PM" && hr !== 12) hr += 12;
    if (ampm === "AM" && hr === 12) hr = 0;
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:00`;
  }, [timeOnly, ampm]);

  // Add date constraints
  const minDate = useMemo(() => todayStr, []);
  const maxDate = useMemo(() => {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() + 5);
    return d.toISOString().split("T")[0];
  }, []);

  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const timeSelectRef = useRef(null);
  const ampmSelectRef = useRef(null);  
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setReasonDesc((prev) => `${prev} ${transcript}`);
      };

      recognition.onerror = (event) => {
        setSpeechError(`Speech error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      recognitionRef.current = null;
    }
  }, []);
  
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
    // { key: "assignDate", label: "Assign Date" },
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
    const [hour, minute] = (history.follow_up_time || "12:00").split(":");
    let hr = parseInt(hour, 10);
    const ampmValue = hr >= 12 ? "PM" : "AM";
    if (hr === 0) hr = 12;
    if (hr > 12) hr -= 12;
  
    setTimeOnly(`${hr.toString().padStart(2, "0")}:${minute}`);
    setAmPm(ampmValue);
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
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use a supported browser like Google Chrome.");
      return;
    }
    setSpeechError(null); // Clear any previous errors
    if (isListening) {
      stopListening();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        setSpeechError("Failed to start speech recognition. Please try again.");
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const { handleSendEmail } = useExecutiveActivity();                                                                                             //Getting Email templates
  const emailTemplates = getEmailTemplates(clientInfo, executiveInfo);

  //State for selecting email template
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleTemplateChange = (e) => {
    setSelectedTemplateId(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSendingEmail(true);

    const selectedTemplate = emailTemplates.find(
      (template) => template.id === selectedTemplateId
    );

    if (!selectedTemplate) {
      alert("Please select a template.");
      return;
    }

    const emailPayload = {
      templateId: selectedTemplate.id,
      executiveName: executiveInfo.username,
      executiveEmail: executiveInfo.email,
      clientEmail: clientInfo.email,
      emailBody: selectedTemplate.body,
      emailSubject: selectedTemplate.subject,
    };

    try {
      await handleSendEmail(emailPayload);
      alert("Email sent successfully!");
      setSendingEmail(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    }
  }; 
  
  const isMeetingInPast = useMemo(() => {
    if (followUpType !== "appointment" || !interactionDate || !interactionTime) return false;
    const selectedDateTime = new Date(`${interactionDate}T${interactionTime}`);
    const now = new Date();
    return selectedDateTime < now;
  }, [followUpType, interactionDate, interactionTime]);
  

  return (
    <div className="client-overview-wrapper">
      {/* Client Details */}
      <div className="c-container">
        <div className="c-header">
          <h2>Client Details</h2>
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
  <div className="follow-up-box">
    <div className="last-follow-up">
      <h3>Last Follow-up</h3>
      {isLoading ? (
        <p>Loading follow-up history...</p>
      ) : histories.length > 0 ? (
        <div className="followup-entry-horizontal">
        <p className="followup-reason">
          {histories[0].reason_for_follow_up || "No description available."}
        </p>
        <strong>
        <p className="followup-time">
          {new Date(histories[0].follow_up_date).toLocaleDateString()} - {histories[0].follow_up_time}
        </p>
        </strong>
      </div>
      
      ) : (
        <p>No follow-up history available.</p>
      )}
    </div>

    {histories.length > 0 && (
      <div className="follow-up-history-summary">
        <div className="history-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {histories.slice(1).map((history, index) => (
  <div key={index} className="followup-entry-plain">
    <p className="followup-reason">{history.reason_for_follow_up}</p>
    <p className="followup-time">
      {new Date(history.follow_up_date).toLocaleDateString()} - {history.follow_up_time}
    </p>
  </div>
))}

        </div>
      </div>
    )}
    </div>

            </div>
          </div>
        </div>
      </div>

      {/* Client Interaction */}
      <div className="client-interaction-container">
        <div className="interaction-form">
        <div>
            <h4 style={{ marginBottom: "0.5rem" }}>Send Email to Client</h4>

            <form
              onSubmit={handleEmailSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap", // for responsiveness
              }}
            >
              <div>
                <label>
                  From:
                  <input
                    type="email"
                    value={executiveInfo.email}
                    readOnly
                    style={{
                      marginLeft: "0.5rem",
                      padding: "8px",
                      borderRadius: "5px",
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  To:
                  <input
                    type="email"
                    value={clientInfo.email}
                    // readOnly
                    style={{
                      marginLeft: "0.5rem",
                      padding: "8px",
                      borderRadius: "5px",
                    }}
                  />
                </label>
              </div>

              <div>
                <label>
                  Template:
                  <select
                    value={selectedTemplateId}
                    onChange={handleTemplateChange}
                    required
                    style={{ marginLeft: "0.5rem" }}
                  >
                    <option value="">Select</option>
                    {emailTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="sendEmail-btn"
                disabled={sendingEmail}
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </form>
          </div>
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
                  placeholder="Type or speak your follow-up reason using the mic"
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
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  <div>
                    <label style={{ display: "block" }}>Date:</label>
                    <input
                      type="date"
                      value={interactionDate}
                      min={minDate}
                      max={maxDate}
                      onChange={(e) => setInteractionDate(e.target.value)}
                      style={{ padding: "8px", borderRadius: "4px" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "4px" }}>Time:</label>
                    <div
                      style={{
                        display: "flex",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        overflow: "hidden",
                        width: "150px",
                        backgroundColor: "white"
                      }}
                    >
                      <div style={{ position: "relative", flex: 1 }}>
                        {!isTimeEditable ? (
                          <>
                            <select
                              ref={timeSelectRef}
                              value={timeOnly}
                              onChange={(e) => {
                                setTimeOnly(e.target.value);
                                setIsTimeEditable(true);
                              }}
                              style={{
                                border: "none",
                                padding: "8px 4px",
                                width: "100%",
                                appearance: "none",
                                backgroundColor: "transparent",
                                cursor: "pointer",
                              }}
                            >
                              <option value={timeOnly}>{timeOnly}</option>
                              {[
                                "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
                                "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
                                "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"
                              ].filter(opt => opt !== timeOnly).map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <span
                              onClick={() => timeSelectRef.current?.focus()}
                              style={{
                                position: "absolute",
                                right: "9px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                                fontSize: "12px",
                                color: "#888"
                              }}
                            >
                              ▼
                            </span>
                          </>
                        ) : (
                          <input
                            type="time"
                            value={convertTo24Hour(timeOnly, ampm)}
                            onChange={(e) => {
                              const time24 = e.target.value;
                              if (time24) {
                                const converted = convertTo12Hour(time24);
                                setTimeOnly(converted.time);
                                setAmPm(converted.amPm);
                              }
                            }}
                            onBlur={() => {
                              // setIsTimeEditable(false);
                            }}
                            style={{
                              border: "none",
                              padding: "8px 4px",
                              width: "100%",
                              backgroundColor: "transparent",
                              cursor: "text",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {isTimeEditable && (
                      <button
                        type="button"
                        onClick={() => setIsTimeEditable(false)}
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          marginTop: "4px",
                          alignSelf: "flex-start"
                        }}
                      >
                        Use preset times
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {followUpType === "appointment" && isMeetingInPast && (
                <div style={{
                  marginTop: "12px",
                  color: "#b71c1c",
                  background: "#fff4f4",
                  borderLeft: "4px solid #e57373",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}>
                  ⚠ Please select a <strong>future date or time</strong> to schedule the meeting.
                </div>
              )}

              <div className="button-group" style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
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
                    className="crm-button flw-close-btn"
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