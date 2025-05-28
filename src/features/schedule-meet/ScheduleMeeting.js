import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock as farClockRegular,
  faSyncAlt,
  faEllipsisV,
  faPlus,
  faChevronDown,
  faHistory,
  faTimes,
  faPhone,
  faEnvelope,
  faComments,
  faVideo,
  faStar,
  faCalendarAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { ThemeProvider } from "../admin/ThemeContext";
import { useApi } from "../../context/ApiContext";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import Swal from "sweetalert2";

// Helper function to check if two dates are the same day
const isSameDay = (d1, d2) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

// Helper function to convert time string to comparable format
const convertTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  
  let cleanTime = timeStr.toString().trim();
  
  if (cleanTime.includes(':')) {
    const parts = cleanTime.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
  }
  
  return 0;
};

// Helper function to create a comparable datetime value
const getComparableDateTime = (history) => {
  const date = new Date(history.follow_up_date || history.created_at);
  const timeInMinutes = convertTimeToMinutes(history.follow_up_time);
  return date.getTime() + (timeInMinutes * 60 * 1000);
};

// Helper function to format interaction schedule date
const formatInteractionSchedule = (meeting) => {
  const interactionDate = meeting.interactionScheduleDate || 
                         meeting.follow_up_date || 
                         meeting.startTime;
  
  if (!interactionDate) return "No schedule set";
  
  const date = new Date(interactionDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to convert time to 24-hour format
const convertTo24HrFormat = (timeStr) => {
  if (!timeStr) return "00:00:00";
  const dateObj = new Date(`1970-01-01 ${timeStr}`);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}:00`;
};

// Capitalize helper function
const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// FollowUpForm component for adding a new follow-up
const FollowUpForm = ({ meeting, onClose, onSubmit }) => {
  const [clientName, setClientName] = useState(meeting.clientName || "");
  const [email, setEmail] = useState(meeting.clientEmail || "");
  const [reasonDesc, setReasonDesc] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [followUpType, setFollowUpType] = useState("");
  const [interactionRating, setInteractionRating] = useState("");
  const [interactionDate, setInteractionDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // e.g. "2025-05-28"
  });
    const now = new Date();
  const defaultTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const [interactionTime, setInteractionTime] = useState(defaultTime);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!clientName) newErrors.clientName = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!reasonDesc) newErrors.reasonDesc = "Follow-up reason is required";
    if (!contactMethod) newErrors.contactMethod = "Please select a contact method";
    if (!followUpType) newErrors.followUpType = "Please select a follow-up type";
    if (!interactionRating) newErrors.interactionRating = "Please select an interaction rating";
    if (!interactionDate) newErrors.interactionDate = "Interaction date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    console.log("Submitting follow-up form with reason:", reasonDesc);

    onSubmit({
      clientName,
      email,
      reason_for_follow_up: reasonDesc,
      connect_via: capitalize(contactMethod),
      follow_up_type: followUpType,
      interaction_rating: capitalize(interactionRating),
      follow_up_date: interactionDate,
      follow_up_time: convertTo24HrFormat(interactionTime),
    });
  };

  return (
    <div className="followup-form-overlay">
      <div className="followup-form-modal">
        <div className="followup-form-header">
          <h3>Add Follow-Up for {meeting.clientName || "Unnamed Client"}</h3>
          <button className="close-form-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="followup-form-content">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="form-input"
              placeholder="Enter client name"
              required
            />
            {errors.clientName && <span className="error-text">{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter email"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Follow-Up Reason</label>
            <textarea
              value={reasonDesc}
              onChange={(e) => setReasonDesc(e.target.value)}
              className="interaction-textarea"
              placeholder="Describe the follow-up reason..."
              required
            />
            {errors.reasonDesc && <span className="error-text">{errors.reasonDesc}</span>}
          </div>
          <div className="form-group">
            <label>Connected Via</label>
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
            {errors.contactMethod && <span className="error-text">{errors.contactMethod}</span>}
          </div>
          <div className="form-group">
            <label>Follow-Up Type</label>
            <div className="radio-group">
              {[
                "interested",
                "appointment",
                "no response",
                "converted",
                "not interested",
                "close"
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
            {errors.followUpType && <span className="error-text">{errors.followUpType}</span>}
          </div>
          <div className="form-group">
            <label>Interaction Rating</label>
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
            {errors.interactionRating && <span className="error-text">{errors.interactionRating}</span>}
          </div>
          <div className="form-group-horizontal">
  <div className="form-subgroup">
    <label>Interaction Date</label>
    <input
      type="date"
      value={interactionDate}
      onChange={(e) => setInteractionDate(e.target.value)}
      className="form-input"
      required
    />
    {errors.interactionDate && <span className="error-text">{errors.interactionDate}</span>}
  </div>
  <div className="form-subgroup">
    <label>Interaction Time</label>
    <TimePicker
      onChange={setInteractionTime}
      value={interactionTime}
      format="hh:mm a"
      disableClock={false}
      clearIcon={null}
      className="form-time-picker"
    />
  </div>
</div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Save Follow-Up
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// FollowUpHistory component to display follow-up history for a meeting
const FollowUpHistory = ({ meeting, onClose }) => {
  const { fetchFollowUpHistoriesAPI } = useApi();
  const [followUpHistories, setFollowUpHistories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!meeting) return;

    const freshLeadId = meeting.fresh_lead_id || 
                       meeting.freshLead?.id || 
                       meeting.clientLead?.freshLead?.id || 
                       meeting.clientLead?.fresh_lead_id ||
                       meeting.freshLead?.lead?.id ||
                       meeting.id;

    console.log("Meeting data for history:", meeting);
    console.log("Extracted freshLeadId:", freshLeadId);

    if (freshLeadId) {
      loadFollowUpHistories(freshLeadId);
    } else {
      console.warn("No valid freshLeadId found for meeting:", meeting);
      setFollowUpHistories([]);
    }
  }, [meeting]);

  const loadFollowUpHistories = async (freshLeadId) => {
    if (!freshLeadId) {
      setFollowUpHistories([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFollowUpHistoriesAPI();
      console.log("Follow-up histories response:", response);

      if (Array.isArray(response)) {
        const normalizedFreshLeadId = String(freshLeadId);
        const filteredHistories = response.filter((history) => {
          const historyLeadId = String(history.fresh_lead_id);
          return historyLeadId === normalizedFreshLeadId;
        });

        if (filteredHistories.length === 0) {
          console.log("No histories match the fresh_lead_id:", normalizedFreshLeadId);
        }

        // Sort by follow_up_date and follow_up_time descending
        const sortedHistories = filteredHistories.sort((a, b) => {
          const dateA = getComparableDateTime(a);
          const dateB = getComparableDateTime(b);
          return dateB - dateA;
        });

        console.log("Sorted histories:", sortedHistories.map(h => ({
          id: h.id,
          follow_up_date: h.follow_up_date,
          follow_up_time: h.follow_up_time,
          created_at: h.created_at,
          reason: h.reason_for_follow_up?.substring(0, 50) + '...'
        })));

        setFollowUpHistories(sortedHistories);
      } else {
        console.error("Follow-up histories response is not an array:", response);
        setFollowUpHistories([]);
      }
    } catch (error) {
      console.error("Error fetching follow-up histories:", error);
      setFollowUpHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const getConnectViaIcon = (connectVia) => {
    switch (connectVia?.toLowerCase()) {
      case 'call':
        return faPhone;
      case 'email':
        return faEnvelope;
      case 'whatsapp':
        return faComments;
      case 'video':
        return faVideo;
      default:
        return faComments;
    }
  };

  const getRatingColor = (rating) => {
    switch (rating?.toLowerCase()) {
      case 'hot':
        return 'rating-hot';
      case 'warm':
        return 'rating-warm';
      case 'cold':
        return 'rating-cold';
      default:
        return 'rating-neutral';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No date available';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr;
    }
    
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    
    return timeStr;
  };

  if (!meeting) return null;

  return (
    <div className="followup-history-overlay">
      <div className="followup-history-modal">
        <div className="followup-history-header">
          <div className="header-content">
            <div className="client-info">
              <div className="client-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="client-details">
                <h3>{meeting.clientName || "Unnamed Client"}</h3>
                <p className="subtitle">Follow-up History</p>
              </div>
            </div>
            <button className="close-history-btn" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
        
        <div className="followup-history-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading follow-up history...</p>
            </div>
          ) : followUpHistories.length > 0 ? (
            <div className="history-timeline">
              {followUpHistories.map((history, index) => (
                <div key={history.id || index} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="timeline-dot">
                      <FontAwesomeIcon icon={faStar} className="history-icon" />
                    </div>
                  </div>
                  
                  <div className="timeline-content">
                    <div className="history-card">
                      <div className="card-header">
                        <div className="date-time-info">
                          <div className="main-date">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>{formatDate(history.follow_up_date || history.created_at)}</span>
                          </div>
                          {history.follow_up_time && (
                            <div className="time-info">
                              <FontAwesomeIcon icon={farClockRegular} />
                              <span>{formatTime(history.follow_up_time)}</span>
                            </div>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="latest-badge">
                            <span>Latest</span>
                          </div>
                        )}
                      </div>

                      <div className="card-content">
                        <div className="interaction-tags">
                          {history.connect_via && (
                            <div className="tag connect-via-tag">
                              <FontAwesomeIcon icon={getConnectViaIcon(history.connect_via)} />
                              <span>{history.connect_via}</span>
                            </div>
                          )}
                          
                          {history.follow_up_type && (
                            <div className="tag follow-up-type-tag">
                              <span>{history.follow_up_type}</span>
                            </div>
                          )}
                          
                          {history.interaction_rating && (
                            <div className={`tag rating-tag ${getRatingColor(history.interaction_rating)}`}>
                              <FontAwesomeIcon icon={faStar} />
                              <span>{history.interaction_rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="follow-up-reason">
                          <h4>Follow-Up Reason</h4>
                          <p>{history.reason_for_follow_up || "No reason provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-history">
              <div className="empty-state">
                <FontAwesomeIcon icon={faHistory} className="empty-icon" />
                <h4>No Follow-up History</h4>
                <p>No follow-up history available for this client.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main ScheduleMeeting component
const ScheduleMeeting = () => {
  const { 
    fetchMeetings, 
    fetchFollowUpHistoriesAPI, 
    updateFollowUp, 
    createFollowUp,
    createFollowUpHistoryAPI, 
    updateMeetingAPI,
    fetchFreshLeadsAPI, 
    refreshMeetings, 
    createConvertedClientAPI, 
    createCloseLeadAPI,
    meetings: contextMeetings
  } = useApi();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [scrolled, setScrolled] = useState(false);
  const [selectedMeetingForHistory, setSelectedMeetingForHistory] = useState(null);
  const [selectedMeetingForFollowUp, setSelectedMeetingForFollowUp] = useState(null);
  const [recentlyUpdatedMeetingId, setRecentlyUpdatedMeetingId] = useState(null);

  const loadMeetings = async () => {
    try {
      const allMeetings = await fetchMeetings();
      if (!Array.isArray(allMeetings)) {
        console.error("Meetings response is not an array:", allMeetings);
        setMeetings([]);
        return;
      }

      const meetingStatusData = allMeetings.filter((m) => m?.clientLead?.status === "Meeting");

      const enrichedMeetings = await Promise.all(
        meetingStatusData.map(async (meeting) => {
          const freshLeadId = meeting.fresh_lead_id || 
                             meeting.freshLead?.id || 
                             meeting.clientLead?.freshLead?.id || 
                             meeting.clientLead?.fresh_lead_id ||
                             meeting.freshLead?.lead?.id ||
                             meeting.id;
          
          if (freshLeadId) {
            try {
              const histories = await fetchFollowUpHistoriesAPI();
              if (Array.isArray(histories) && histories.length > 0) {
                const recentHistory = histories
                  .filter(h => String(h.fresh_lead_id) === String(freshLeadId))
                  .sort((a, b) => new Date(b.created_at || b.follow_up_date) - new Date(a.created_at || a.follow_up_date))[0];
                
                if (recentHistory) {
                  return {
                    ...meeting,
                    interactionScheduleDate: recentHistory.follow_up_date,
                    interactionScheduleTime: recentHistory.follow_up_time,
                    followUpDetails: recentHistory
                  };
                }
              }
            } catch (error) {
              console.error("Error fetching follow-up history for meeting:", meeting.id, error);
            }
          }
          
          return meeting;
        })
      );

      const now = new Date();
      const filtered = enrichedMeetings.filter((m) => {
        if (recentlyUpdatedMeetingId && m.id === recentlyUpdatedMeetingId) {
          console.log(`Including recently updated meeting ID ${m.id}`);
          return true;
        }

        const startDate = new Date(m.startTime);
        if (activeFilter === "today") return isSameDay(startDate, now);
        if (activeFilter === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return startDate >= weekAgo && startDate <= now;
        }
        if (activeFilter === "month") {
          return (
            startDate.getFullYear() === now.getFullYear() &&
            startDate.getMonth() === now.getMonth()
          );
        }
        return true;
      });

      console.log("Filtered meetings:", filtered.map(m => ({
        id: m.id,
        clientName: m.clientName,
        startTime: m.startTime,
        status: m.clientLead?.status,
        recentlyUpdated: m.id === recentlyUpdatedMeetingId
      })));
      setMeetings(filtered);
    } catch (error) {
      console.error("Error loading meetings:", error);
      setMeetings([]);
    }
  };

  const handleAddFollowUp = (meeting) => {
    setSelectedMeetingForFollowUp(meeting);
  };

  const handleCloseFollowUpForm = () => {
    setSelectedMeetingForFollowUp(null);
  };

  const handleFollowUpSubmit = async (formData) => {
    const { 
      clientName, 
      email, 
      reason_for_follow_up, 
      connect_via, 
      follow_up_type, 
      interaction_rating, 
      follow_up_date, 
      follow_up_time 
    } = formData;
    const meeting = selectedMeetingForFollowUp;

    console.log("Received formData:", formData);
    console.log("Reason for follow-up:", reason_for_follow_up);

    const freshLeadId = meeting.fresh_lead_id || 
                        meeting.freshLead?.id || 
                        meeting.clientLead?.freshLead?.id || 
                        meeting.clientLead?.fresh_lead_id || 
                        meeting.freshLead?.lead?.id || 
                        meeting.id || 
                        meeting.clientLead?.id;

    console.log("Meeting object for freshLeadId extraction:", meeting);
    console.log("Extracted freshLeadId:", freshLeadId);

    if (!freshLeadId) {
      Swal.fire({
        icon: "error",
        title: "Missing Lead ID",
        text: "Unable to find the lead ID. Please ensure the meeting data is correct and try again.",
      });
      return;
    }

    try {
      let followUpId;
      try {
        const histories = await fetchFollowUpHistoriesAPI();
        if (Array.isArray(histories) && histories.length > 0) {
          const recentHistory = histories
            .filter(h => String(h.fresh_lead_id) === String(freshLeadId))
            .sort((a, b) => new Date(b.created_at || b.follow_up_date) - new Date(a.created_at || a.follow_up_date))[0];
          followUpId = recentHistory.follow_up_id;
          console.log("Found existing follow-up with ID:", followUpId);
        }
      } catch (error) {
        console.log("No existing follow-up history found for freshLeadId:", freshLeadId);
      }

      const followUpData = {
        connect_via,
        follow_up_type,
        interaction_rating,
        reason_for_follow_up,
        follow_up_date,
        follow_up_time,
        fresh_lead_id: freshLeadId,
      };

      console.log("Submitting followUpData:", followUpData);

      if (followUpId) {
        console.log("Submitting updateFollowUp with payload:", followUpData);
        await updateFollowUp(followUpId, followUpData);
      } else {
        console.log("Submitting createFollowUp with payload:", followUpData);
        const createResponse = await createFollowUp(followUpData);
        followUpId = createResponse.data.id;
        console.log("Created new follow-up with ID:", followUpId);
      }

      if (!followUpId) {
        throw new Error("Failed to obtain follow-up ID after creation or update.");
      }

      const historyPayload = {
        follow_up_id: followUpId,
        connect_via,
        follow_up_type,
        interaction_rating,
        reason_for_follow_up,
        follow_up_date,
        follow_up_time,
        fresh_lead_id: freshLeadId,
      };

      console.log("Submitting createFollowUpHistoryAPI with payload:", historyPayload);
      await createFollowUpHistoryAPI(historyPayload);

      const leadDetails = {
        fresh_lead_id: freshLeadId,
        clientName,
        email,
        phone: meeting.clientPhone,
        reason_for_follow_up,
        connect_via,
        follow_up_type,
        interaction_rating,
        follow_up_date,
        follow_up_time,
      };

      if (follow_up_type === "converted") {
        console.log("Converting client with fresh_lead_id:", freshLeadId);
        await createConvertedClientAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Client Converted" });
        navigate("/customer", { state: { lead: leadDetails } });
        setMeetings((prevMeetings) => prevMeetings.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "close") {
        console.log("Closing lead with fresh_lead_id:", freshLeadId);
        await createCloseLeadAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Lead Closed" });
        navigate("/close-leads", { state: { lead: leadDetails } });
        setMeetings((prevMeetings) => prevMeetings.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "appointment") {
        const meetingPayload = {
          clientName,
          clientEmail: email,
          clientPhone: meeting.clientPhone,
          reasonForFollowup: reason_for_follow_up,
          startTime: new Date(`${follow_up_date}T${follow_up_time}`).toISOString(),
          endTime: meeting.endTime || null,
          fresh_lead_id: freshLeadId,
        };
        const updatedMeeting = await updateMeetingAPI(meeting.id, meetingPayload);

        setMeetings((prevMeetings) =>
          prevMeetings.map((m) =>
            m.id === meeting.id
              ? {
                  ...m,
                  ...updatedMeeting,
                  interactionScheduleDate: follow_up_date,
                  interactionScheduleTime: follow_up_time,
                  clientLead: { ...m.clientLead, status: "Meeting" }
                }
              : m
          )
        );

        setRecentlyUpdatedMeetingId(meeting.id);
        Swal.fire({ icon: "success", title: "Meeting Updated" });
      } else if (follow_up_type === "interested") {
        // Add a specific API call here if needed e.g., await createInterestedLeadAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Marked as Interested" });
        navigate("/follow-up", { state: { lead: leadDetails } });
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "not interested") {
        // Add a specific API call here if needed e.g., await markLeadNotInterestedAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Marked as Not Interested" });
        navigate("/follow-up", { state: { lead: leadDetails } });
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else {
        Swal.fire({ icon: "success", title: "Follow-Up Updated" });
      }

      await fetchFreshLeadsAPI();
      await refreshMeetings();
      await loadMeetings();
      handleCloseFollowUpForm();
    } catch (error) {
      console.error("Error saving follow-up:", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [activeFilter]);

  const handleScroll = (e) => setScrolled(e.target.scrollTop > 10);
  const handleShowHistory = (meeting) => setSelectedMeetingForHistory(meeting);
  const handleCloseHistory = () => setSelectedMeetingForHistory(null);

  return (
    <div className="task-management-container">
      <div className="task-management-wrapper">
        <div className="content-header">
          <div className="header-top">
            <div className="header-left">
              <h2 className="meetings-title">Your Meetings</h2>
              <div className="date-section">
                <p className="day-name">{new Date().toLocaleDateString(undefined, { weekday: 'long' })}</p>
                <p className="current-date">{new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</p>
                <FontAwesomeIcon icon={faChevronDown} className="date-dropdown" />
              </div>
            </div>
            <div className="filter-controls">
              {['today', 'week', 'month'].map((key) => (
                <button
                  key={key}
                  className={activeFilter === key ? 'active-filter' : ''}
                  onClick={() => setActiveFilter(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
              <button className="refresh-button" onClick={loadMeetings}>
                <FontAwesomeIcon icon={faSyncAlt} />
              </button>
            </div>
          </div>
        </div>
        <div className="meetings-content" onScroll={handleScroll}>
          <ul className="meetings-list">
            {meetings.length > 0 ? (
              meetings.map((meeting) => {
                const start = new Date(meeting.startTime);
                const end = meeting.endTime ? new Date(meeting.endTime) : null;
                return (
                  <li key={meeting.id} className={`meeting-item ${meeting.highlighted ? 'highlighted-meeting' : ''}`}>
                    <div className="meeting-time">
                      <p className="start-time">{start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                      {end && <p className="end-time">{end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>}
                    </div>
                    <div className="meeting-interaction-schedule">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <span>{formatInteractionSchedule(meeting)}</span>
                    </div>
                    <div className="meeting-details">
                      <p className="metadata">{meeting.clientName || meeting.clientDetails || "Unknown Client"}</p>
                    </div>
                    <div className="meeting-contact-info">
                      {meeting.clientEmail && (
                        <div className="contact-item">
                          <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                          <span className="contact-text">{meeting.clientEmail}</span>
                        </div>
                      )}
                      {meeting.clientPhone && (
                        <div className="contact-item">
                          <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                          <span className="contact-text">{meeting.clientPhone}</span>
                        </div>
                      )}
                    </div>
                    <div className="meeting-attendees">
                      <button className="add-attendee" onClick={() => handleAddFollowUp(meeting)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Follow up</span>
                      </button>
                    </div>
                    <div className="meeting-actions">
                      <button
                        className="history-button"
                        onClick={() => handleShowHistory(meeting)}
                        title="View Follow-up History"
                      >
                        <FontAwesomeIcon icon={faHistory} />
                        <span>Follow History</span>
                      </button>
                      <button className="meeting-options">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="no-meetings">No meetings scheduled</li>
            )}
          </ul>
        </div>
      </div>
      {selectedMeetingForHistory && (
        <FollowUpHistory meeting={selectedMeetingForHistory} onClose={handleCloseHistory} />
      )}
      {selectedMeetingForFollowUp && (
        <FollowUpForm
          meeting={selectedMeetingForFollowUp}
          onClose={handleCloseFollowUpForm}
          onSubmit={handleFollowUpSubmit}
        />
      )}
    </div>
  );
};

const ScheduleMeetingWithTheme = () => (
  <ThemeProvider>
    <ScheduleMeeting />
  </ThemeProvider>
);

export default ScheduleMeetingWithTheme;