import React, { useState, useEffect, useRef, useMemo } from "react";
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
  const seconds = "00";
  return `${hours}:${minutes}:${seconds}`;
}

const ClientOverview = () => {
  const { clientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const client = useMemo(() => location.state?.client || {}, []);
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
    fetchNotifications,
    createCopyNotification,
    createFollowUpHistoryAPI,
  } = useApi();

  useCopyNotification(createCopyNotification, fetchNotifications);
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

  const timeSelectRef = useRef(null);
  const ampmSelectRef = useRef(null);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);
  const interactionTime = useMemo(() => {
    let [hr, min] = timeOnly.split(":").map(Number);
    if (ampm === "PM" && hr !== 12) hr += 12;
    if (ampm === "AM" && hr === 12) hr = 0;
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:00`;
  }, [timeOnly, ampm]);

  const minDate = useMemo(() => todayStr, []);
  const maxDate = useMemo(() => {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() + 5);
    return d.toISOString().split("T")[0];
  }, []);

  const minTime = interactionDate === minDate ? `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}` : "00:00";

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
  ];

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const handleChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextUpdate = async () => {
    if (!followUpType || !interactionDate || !interactionTime) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a follow-up type, date and time before updating.",
      });
    }

    const followUpId = clientInfo.followUpId || clientInfo.freshLeadId || clientInfo.id;
    if (!followUpId) {
      console.error("Missing follow-up ID on clientInfo:", clientInfo);
      return Swal.fire({
        icon: "error",
        title: "Missing Record ID",
        text: "Unable to find the record to update. Please reload and try again.",
      });
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
        
        Swal.fire({ 
          icon: "success", 
          title: "Appointment Created",
          text: "Appointment created and lead moved to Meeting"
        });
        
        setTimeout(() => navigate("/freshlead"), 1000);
        return;
      } else {
        const updatedData = {
          followUpStatus: followUpType,
          followUpDate: interactionDate,
        };

        await updateFreshLeadFollowUp(followUpId, updatedData);
        
        Swal.fire({ 
          icon: "success", 
          title: "Follow-up Updated",
          text: "Follow-up status updated successfully"
        });

        await fetchFreshLeads();
        setTimeout(() => navigate("/freshlead"), 2000);
      }

      setFollowUpType("");
      setInteractionDate("");
      setTimeOnly("12:00");
      setAmPm("AM");
      setIsTimeEditable(false);
      setReasonDesc("");
    } catch (error) {
      console.error("Error in handleTextUpdate:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
      });
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
      return Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill out all required fields before creating follow-up.",
      });
    }

    const newFollowUpData = {
      connect_via: contactMethod,
      follow_up_type: followUpType,
      interaction_rating: interactionRating,
      reason_for_follow_up: reasonDesc,
      follow_up_date: interactionDate,
      follow_up_time: convertTo24HrFormat(interactionTime),
      fresh_lead_id: clientInfo.freshLeadId || clientInfo.id,
    };

    createFollowUp(newFollowUpData)
      .then((response) => {
        let followUpId = null;

        if (response && response.id) {
          followUpId = response.id;
        } else if (response && response.followUp && response.followUp.id) {
          followUpId = response.followUp.id;
        } else if (response && response.data && response.data.id) {
          followUpId = response.data.id;
        } else if (response && response.data && response.data.followUp && response.data.followUp.id) {
          followUpId = response.data.followUp.id;
        }
        if (!followUpId) {
          console.error("Failed to get follow-up ID from response:", response);
          throw new Error("Missing follow-up ID in response");
        }

        const followUpHistoryData = {
          follow_up_id: followUpId,
          connect_via: contactMethod,
          follow_up_type: followUpType,
          interaction_rating: interactionRating,
          reason_for_follow_up: reasonDesc,
          follow_up_date: interactionDate,
          follow_up_time: convertTo24HrFormat(interactionTime),
          fresh_lead_id: clientInfo.freshLeadId || clientInfo.id,
        };
        return createFollowUpHistoryAPI(followUpHistoryData);
      })
      .then((historyResponse) => {
        Swal.fire({ 
          icon: "success", 
          title: "Follow-up Created",
          text: "Follow-up and history created successfully!"
        });

        setReasonDesc("");
        setContactMethod("");
        setFollowUpType("");
        setInteractionRating("");
        setInteractionDate(todayStr);
        setTimeOnly("12:00");
        setAmPm("AM");
        setIsTimeEditable(false);
        setTimeout(() => navigate("/freshlead"), 2000);
      })
      .catch((error) => {
        console.error("Error creating Follow-up or history:", error);
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: "Failed to create follow-up or history. Please try again.",
        });
      });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      return Swal.fire({
        icon: "error",
        title: "Speech Recognition Not Supported",
        text: "Speech recognition is not supported in this browser. Please use a supported browser like Google Chrome.",
      });
    }
    isListening ? stopListening() : recognitionRef.current.start();
    setIsListening(!isListening);
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const { handleSendEmail } = useExecutiveActivity();
  const emailTemplates = getEmailTemplates(clientInfo, executiveInfo);

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
      setSendingEmail(false);
      return Swal.fire({
        icon: "warning",
        title: "No Template Selected",
        text: "Please select a template.",
      });
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
      Swal.fire({ 
        icon: "success", 
        title: "Email Sent",
        text: "Email sent successfully!"
      });
      setSendingEmail(false);
    } catch (err) {
      console.error(err);
      setSendingEmail(false);
      Swal.fire({
        icon: "error",
        title: "Email Failed",
        text: "Failed to send email.",
      });
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
                      <label className="label">{label}:</label>
                      <input
                        type="text"
                        value={clientInfo[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="client-input"
                      />
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
          <div>
            <h4 style={{ marginBottom: "0.5rem" }}>Send Email to Client</h4>
            <form
              onSubmit={handleEmailSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
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
              {["Call", "Email", "Call/Email"].map((method) => (
                <label key={method} className="radio-container">
                  <input
                    type="radio"
                    name="contactMethod"
                    checked={contactMethod === method}
                    onChange={() => setContactMethod(method)}
                  />
                  <span className="radio-label">{method}</span>
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

              <div className="client-btn">
                <button
                  className="update-btn"
                  onClick={handleTextUpdate}
                  disabled={followUpLoading}
                >
                  {followUpType === "appointment" ? "Create Meeting" : "Update FreshLead"}
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

export default ClientOverview;