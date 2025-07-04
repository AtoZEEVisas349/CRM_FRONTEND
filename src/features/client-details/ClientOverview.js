import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext";
import { getEmailTemplates } from "../../static/emailTemplates";
import Swal from "sweetalert2";
import useCopyNotification from "../../hooks/useCopyNotification";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import SendEmailToClients from "./SendEmailToClients";

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
    fetchFreshLeads,
    executiveInfo,
    fetchNotifications,
    createCopyNotification,
    createFollowUpHistoryAPI,
    createConvertedClientAPI,
    createCloseLeadAPI,
    updateClientLead,
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Added
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

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // ENABLE continuous listening
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setReasonDesc((prev) => `${prev} ${transcript}`);
      };

      recognition.onerror = (event) => {
        Swal.fire({
          icon: "error",
          title: "Speech Error",
          text: `Speech recognition error: ${event.error}`,
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        // Don’t reset isListening here if we're actively listening
        if (isListeningRef.current) {
          recognition.start(); // restart automatically
        } else {
          setIsListening(false); // only stop if we actually intended to
        }
      };

      recognitionRef.current = recognition;
    } else {
      recognitionRef.current = null;
    }
  }, []);


  const handleChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  const [followUpHistory, setFollowUpHistory] = useState([]);

  useEffect(() => {
    if (location.state?.followUpHistory?.length) {
      setFollowUpHistory(location.state.followUpHistory);
    }
  }, [location.state]);

  // ✅ Updated handleSaveClientDetails to use clientId from useParams
  const handleSaveClientDetails = async () => {
    if (!clientId) {
      return Swal.fire({
        icon: "error",
        title: "Missing Client ID",
        text: "Unable to save client details without a valid client ID.",
      });
    }

    setIsSaving(true);
    try {
      const updateFields = {
        name: clientInfo.name || "",
        email: clientInfo.email || "",
        phone: clientInfo.phone || "",
        altPhone: clientInfo.altPhone || "",
        education: clientInfo.education || "",
        experience: clientInfo.experience || "",
        state: clientInfo.state || "",
        dob: clientInfo.dob || "",
        country: clientInfo.country || "",
      };

      await updateClientLead(clientId, updateFields); // ✅ Use clientId from useParams
      await Swal.fire({
        icon: "success",
        title: "Client Updated",
        text: "Client details have been updated successfully!",
      });
    } catch (error) {
      console.error("❌ Error updating client details:", error);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update client details. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleTextUpdate = async () => {
    if (!followUpType || !interactionDate || !interactionTime) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a follow-up type, date and time before updating.",
      });
    }

    const freshLeadId = clientInfo.freshLeadId || clientInfo.id;
    if (!freshLeadId) {
      console.error("Missing fresh lead ID on clientInfo:", clientInfo);
      return Swal.fire({
        icon: "error",
        title: "Missing Record ID",
        text: "Unable to find the record to update. Please reload and try again.",
      });
    }

    try {
      let followUpId = clientInfo.followUpId;

      if (!followUpId) {
        const newFollowUpData = {
          connect_via: capitalize(contactMethod),
          follow_up_type: followUpType,
          interaction_rating: capitalize(interactionRating),
          reason_for_follow_up: reasonDesc,
          follow_up_date: interactionDate,
          follow_up_time: convertTo24HrFormat(interactionTime),
          fresh_lead_id: freshLeadId,
        };

        const followUpResponse = await createFollowUp(newFollowUpData);
        followUpId = followUpResponse?.id || followUpResponse?.data?.id || followUpResponse?.followUp?.id || followUpResponse?.data?.followUp?.id;

        if (!followUpId) {
          console.error("Failed to get follow-up ID from response:", followUpResponse);
          throw new Error("Missing follow-up ID in response");
        }
      }

      const followUpHistoryPayload = {
        follow_up_id: followUpId,
        connect_via: capitalize(contactMethod),
        follow_up_type: followUpType,
        interaction_rating: capitalize(interactionRating),
        reason_for_follow_up: reasonDesc,
        follow_up_date: interactionDate,
        follow_up_time: convertTo24HrFormat(interactionTime),
        fresh_lead_id: freshLeadId,
      };

      if (followUpType === "appointment") {
        const meetingPayload = {
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          clientPhone: clientInfo.phone,
          reasonForFollowup: reasonDesc,
          startTime: new Date(`${interactionDate}T${interactionTime}`).toISOString(),
          endTime: null,
          fresh_lead_id: freshLeadId,
        };
        await createMeetingAPI(meetingPayload);
        await createFollowUpHistoryAPI(followUpHistoryPayload);

        await Swal.fire({
          icon: "success",
          title: "Appointment Created",
          text: "Appointment created and lead moved to Meeting"
        });

        setTimeout(() => navigate("/executive/freshlead"), 1000);
        return;
      } else if (followUpType === "converted") {
        await createConvertedClientAPI({ fresh_lead_id: freshLeadId });
        await createFollowUpHistoryAPI(followUpHistoryPayload);
        await Swal.fire({
          icon: "success",
          title: "Client Converted",
          text: "Lead has been converted successfully!"
        });
        try {
          await fetchFreshLeads();
        } catch (fetchError) {
          console.warn("Warning: Failed to fetch fresh leads after conversion:", fetchError);
        }
        setTimeout(() => navigate("/executive/freshlead"), 1000);
        return;
      } else if (followUpType === "close") {
        await createCloseLeadAPI({ fresh_lead_id: freshLeadId });
        await createFollowUpHistoryAPI(followUpHistoryPayload);
        await Swal.fire({
          icon: "success",
          title: "Lead Closed",
          text: "Lead has been closed successfully!"
        });
        try {
          await fetchFreshLeads();
        } catch (fetchError) {
          console.warn("Warning: Failed to fetch fresh leads after closing:", fetchError);
        }
        setTimeout(() => navigate("/executive/freshlead"), 1000);
        return;
      } else {
        const updatedData = {
          followUpStatus: followUpType,
          followUpDate: interactionDate,
        };

        await updateFreshLeadFollowUp(freshLeadId, updatedData);
        await createFollowUpHistoryAPI(followUpHistoryPayload);

        await Swal.fire({
          icon: "success",
          title: "Follow-up Updated",
          text: "Follow-up status updated successfully"
        });

        try {
          await fetchFreshLeads();
        } catch (fetchError) {
          console.warn("Warning: Failed to fetch fresh leads after update:", fetchError);
        }
        setTimeout(() => navigate("/executive/freshlead"), 2000);
      }

      setFollowUpType("");
      setInteractionDate("");
      setTimeOnly("12:00");
      setAmPm("AM");
      setIsTimeEditable(false);
      setReasonDesc("");
      setContactMethod("");
      setInteractionRating("");
    } catch (error) {
      console.error("Error in handleTextUpdate:", error);
      await Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleCreateFollowUp = async () => {
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

    const freshLeadId = clientInfo.freshLeadId || clientInfo.id;
    if (!freshLeadId) {
      console.error("Missing fresh lead ID on clientInfo:", clientInfo);
      return Swal.fire({
        icon: "error",
        title: "Missing Record ID",
        text: "Unable to find the record to create follow-up. Please reload and try again.",
      });
    }

    const newFollowUpData = {
      connect_via: capitalize(contactMethod),
      follow_up_type: followUpType,
      interaction_rating: capitalize(interactionRating),
      reason_for_follow_up: reasonDesc,
      follow_up_date: interactionDate,
      follow_up_time: convertTo24HrFormat(interactionTime),
      fresh_lead_id: freshLeadId,
    };

    try {
      const response = await createFollowUp(newFollowUpData);
      let followUpId = response?.id || response?.data?.id || response?.followUp?.id || response?.data?.followUp?.id;

      if (!followUpId) {
        console.error("Failed to get follow-up ID from response:", response);
        throw new Error("Missing follow-up ID in response");
      }

      const followUpHistoryData = {
        follow_up_id: followUpId,
        connect_via: capitalize(contactMethod),
        follow_up_type: followUpType,
        interaction_rating: capitalize(interactionRating),
        reason_for_follow_up: reasonDesc,
        follow_up_date: interactionDate,
        follow_up_time: convertTo24HrFormat(interactionTime),
        fresh_lead_id: freshLeadId,
      };

      await createFollowUpHistoryAPI(followUpHistoryData);

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
      setTimeout(() => navigate("/executive/freshlead"), 2000);
    } catch (error) {
      console.error("Error creating Follow-up or history:", error.message, {
        status: error.response?.status,
        url: error.config?.url,
        payload: newFollowUpData,
      });
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: "Failed to create follow-up or history. Please try again.",
      });
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      return Swal.fire({
        icon: "error",
        title: "Speech Recognition Not Supported",
        text: "Speech recognition is not supported in this browser. Please use a supported browser like Google Chrome.",
      });
    }

    if (isListening) {
      stopListening(); // Ensure this executes fully before setting state
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };


  const { handleSendEmail } = useExecutiveActivity();

  const handleTemplateSelect = (template, clientEmail) => {
    if (template) {
      setSelectedTemplate(template);
      setEmailBody(template.body);
      setEmailSubject(template.subject);
      setClientEmail(clientEmail);
      setShowEmailModal(true);
    } else {
      setShowEmailModal(false);
      setSelectedTemplate(null);
      setEmailBody("");
      setEmailSubject("");
      setClientEmail("");
    }
  };
  useEffect(() => {
    console.log("Template selected:", selectedTemplate);
    console.log("Show Email Modal?", showEmailModal);
  }, [selectedTemplate, showEmailModal]);
  
  const handleEmailSubmit = async () => {
    setSendingEmail(true);

    try {
      const emailPayload = {
        templateId: selectedTemplate.id,
        executiveName: executiveInfo.username,
        executiveEmail: executiveInfo.email,
        clientEmail: clientInfo.email,
        emailBody: emailBody,
        emailSubject: emailSubject,
      };

      await handleSendEmail(emailPayload);
      alert("Email sent successfully!");
      setShowEmailModal(false);
      setSelectedTemplate(null);
      setEmailBody("");
      setEmailSubject("");
      setClientEmail("");
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    } finally {
      setSendingEmail(false);
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
                  <button
                    onClick={handleSaveClientDetails}
                    disabled={isSaving}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      opacity: isSaving ? 0.6 : 1,
                      marginTop: "20px",
                    }}
                  >
                    {isSaving ? "Saving..." : "Save Client Details"}
                  </button>
                </div>
              </div>
            </div>

            <div className="follow-up-column">
              <div className="follow-up-box">
                <div className="last-follow-up">
                  <h3>Last Follow-up</h3>
                  {followUpHistory.length > 0 ? (
                    <div className="followup-entry-horizontal">
                      <p className="followup-reason">
                        {followUpHistory[0].reason_for_follow_up || "No description available."}
                      </p>
                      <strong>
                        <p className="followup-time">
                          {new Date(followUpHistory[0].follow_up_date).toLocaleDateString()} - {followUpHistory[0].follow_up_time}
                        </p>
                      </strong>
                    </div>
                  ) : (
                    <p>No follow-up history available.</p>
                  )}
                </div>

                {followUpHistory.length > 1 && (
                  <div className="follow-up-history-summary">
                    <div className="history-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {followUpHistory.slice(1).map((history, index) => (
                        <div key={index} className="followup-entry-plain">
                          <p className="followup-reason">{history.reason_for_follow_up || "—"}</p>
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
      <div className="client-interaction-container">
        <div className="interaction-form">
          <div style={{ position: "relative" }}>
            <SendEmailToClients clientInfo={clientInfo} onTemplateSelect={handleTemplateSelect} />
            {showEmailModal && (
              <div
                style={{
                  position: "absolute",
                  left: 800,
                  width: "400px",
                  backgroundColor: "#f5f7fa",
                  border: "1px solid #e0e0e0",
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  zIndex: 6,
                  padding: "15px",
                  height: "auto",
                  marginTop: "-60px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "5px",
                    marginBottom: "10px",
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: "16px" }}>New Message</h4>
                  <div>
                    <button
                      onClick={() => setShowEmailModal(false)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginLeft: "10px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>
                    To
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    style={{
                      width: "100%",
                      height: "150px",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                    placeholder="Email body"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleEmailSubmit}
                    disabled={sendingEmail}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: sendingEmail ? "not-allowed" : "pointer",
                      opacity: sendingEmail ? 0.6 : 1,
                    }}
                  >
                    {sendingEmail ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="connected-via" style={{ marginBottom: "20px" }}>
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
          <div className="follow-up-type" style={{ marginBottom: "20px" }}>
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

          <div className="interaction-rating" >
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
                          <div>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Time:</label>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "0 10px",
                                backgroundColor: "#fff",
                                height: "38px"
                              }}
                            >
                              {/* HH:MM SELECT */}
                              <select
                                value={timeOnly}
                                onChange={(e) => setTimeOnly(e.target.value)}
                                style={{
                                  border: "none",
                                  padding: "8px 6px",
                                  fontSize: "14px",
                                  height: "100%",
                                  outline: "none",
                                  backgroundColor: "transparent",
                                  appearance: "none"
                                }}
                              >
                                {Array.from({ length: 12 }, (_, i) =>
                                  [0, 15, 30, 45].map((min) => {
                                    const hour = i + 1;
                                    const hStr = hour.toString().padStart(2, "0");
                                    const mStr = min.toString().padStart(2, "0");
                                    return (
                                      <option key={`${hStr}:${mStr}`} value={`${hStr}:${mStr}`}>
                                        {`${hStr}:${mStr}`}
                                      </option>
                                    );
                                  })
                                ).flat()}
                              </select>

                              {/* AM/PM SELECT */}
                              <select
                                value={ampm}
                                onChange={(e) => setAmPm(e.target.value)}
                                style={{
                                  border: "none",
                                  padding: "8px 6px",
                                  fontSize: "14px",
                                  height: "100%",
                                  outline: "none",
                                  backgroundColor: "transparent",
                                  appearance: "none"
                                }}
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
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
              {["appointment", "converted", "close"].includes(followUpType) && (
  <button
    className="update-btn"
    onClick={handleTextUpdate}
    disabled={followUpLoading}
    style={{
      backgroundColor:
        followUpType === "converted"
          ? "#28a745"
          : followUpType === "close"
          ? "#dc3545"
          : "#17a2b8", // for "appointment"
      color: "white",
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: followUpLoading ? "not-allowed" : "pointer",
      opacity: followUpLoading ? 0.6 : 1,
    }}
  >
    {followUpType === "appointment"
      ? "Create Meeting"
      : followUpType === "converted"
      ? "Convert"
      : "Close"}
  </button>
)}

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