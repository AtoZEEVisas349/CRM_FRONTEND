import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCalendarAlt,
  faClock as farClockRegular,
  faEnvelope,
  faPhone,
  faComments,
  faVideo,
  faStar,
  faTimes,
  faHistory,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useProcessService } from "../../context/ProcessServiceContext";
import ProcessMeetingItem from "./ProcessMeetingItem";
import LoadingSpinner from "../spinner/LoadingSpinner";
import { isSameDay } from "../../utils/helpers";

const ProcessScheduleMeeting = () => {
  const {
    createFollowUp,
    getProcessPersonMeetings,
    updateFollowUp,
    createFollowUpHistoryAPI,
    getProcessFollowup, // ✅ pulled from context
  } = useProcessService();

  const [meetings, setMeetings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [loading, setLoading] = useState(false);
  const [selectedMeetingForFollowUp, setSelectedMeetingForFollowUp] = useState(null);
  const [selectedMeetingForHistory, setSelectedMeetingForHistory] = useState(null);
  const [followUpHistoryList, setFollowUpHistoryList] = useState([]); // ✅ new state

  useEffect(() => {
    loadMeetings();
  }, [activeFilter]);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const allMeetings = await getProcessPersonMeetings(); // ✅ from context
      const today = new Date();
  
      const filtered = allMeetings.filter((m) => {
        const start = new Date(m.startTime);
  
        if (activeFilter === "today") return isSameDay(start, today);
  
        if (activeFilter === "week") {
          const week = new Date(today);
          week.setDate(week.getDate() + 7);
          return start >= today && start < week;
        }
  
        if (activeFilter === "month") {
          const month = new Date(today);
          month.setDate(month.getDate() + 30);
          return start >= today && start < month;
        }
  
        return true;
      });
  
      setMeetings(filtered);
    } catch (err) {
      console.error("Failed to fetch process meetings", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleShowHistory = async (meeting) => {
    setSelectedMeetingForHistory(meeting);
    setLoading(true);

    try {
      const leadId =
        meeting?.fresh_lead_id ||
        meeting?.freshLead?.id ||
        meeting?.lead?.id ||
        meeting?.id;

      if (!leadId) {
        console.warn("❌ Missing leadId in meeting:", meeting);
        setFollowUpHistoryList([]);
        return;
      }

      const result = await getProcessFollowup(leadId);

      const sorted = Array.isArray(result?.data)
        ? [...result.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setFollowUpHistoryList(sorted);
    } catch (err) {
      console.error("Failed to fetch follow-up history", err);
      setFollowUpHistoryList([]);
    } finally {
      setLoading(false);
    }
  };

  

  const handleSubmitFollowUp = async (data) => {
    try {
      const { reason, method, type, date, time } = data;
      const leadId = selectedMeetingForFollowUp?.leadId;

      const payload = {
        follow_up_type: type,
        follow_up_date: date,
        follow_up_time: time,
        reason_for_follow_up: reason,
        connect_via: method,
        lead_id: leadId,
      };

      const res = await createFollowUp(payload);
      payload.follow_up_id = res?.data?.id;

      await createFollowUpHistoryAPI(payload);

      Swal.fire({ icon: "success", title: "Follow-Up Saved!" });
      setSelectedMeetingForFollowUp(null);
      loadMeetings();
    } catch (err) {
      console.error("Follow-up failed", err);
      Swal.fire({ icon: "error", title: "Failed to submit follow-up" });
    }
  };

  return (
    <div className="task-management-container">
      {loading && <LoadingSpinner text="Loading Process Meetings..." />}

      <div className="task-management-wrapper">
        <div className="content-header">
          <div className="header-top">
            <div className="header-left">
              <h2 className="meetings-title">Process Person Meetings</h2>
              <div className="date-section">
                <p className="day-name">
                  {new Date().toLocaleDateString(undefined, { weekday: "long" })}
                </p>
                <p className="current-date">
                  {new Date().toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <FontAwesomeIcon icon={faChevronDown} className="date-dropdown" />
              </div>
            </div>
            <div className="filter-controls">
              {["today", "week", "month"].map((key) => (
                <button
                  key={key}
                  className={activeFilter === key ? "active-filter" : ""}
                  onClick={() => setActiveFilter(key)}
                  disabled={loading}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="meetings-list">
          {meetings.length > 0 ? (
            meetings.map((m) => (
              <ProcessMeetingItem
                key={m.id}
                meeting={m}
                onAddFollowUp={() => setSelectedMeetingForFollowUp(m)}
                onShowHistory={() => handleShowHistory(m)} // ✅ use handler
              />
            ))
          ) : (
            <li>No Process Meetings</li>
          )}
        </ul>
      </div>

      {selectedMeetingForFollowUp && (
  <div className="followup-form-overlay">
    <div className="followup-form-modal">
      <div className="followup-form-header">
        <h3>Add Follow-Up for {selectedMeetingForFollowUp.clientName || "Unnamed Client"}</h3>
        <button
          className="close-form-btn"
          onClick={() => setSelectedMeetingForFollowUp(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const reason = form.reason.value;
          const method = form.method.value;
          const type = form.type.value;
          const date = form.date.value;
          const time = form.time.value;
          handleSubmitFollowUp({ reason, method, type, date, time });
        }}
        className="followup-form-content"
      >
        <div className="form-group">
          <label>Follow-Up Reason</label>
          <textarea
            name="reason"
            className="interaction-textarea"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Connected Via</label>
          <div className="radio-group">
            {["call", "email"].map((method) => (
              <label key={method} className="radio-container">
                <input type="radio" name="method" value={method} required />
                <span className="radio-label">
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Follow-Up Type</label>
          <div className="radio-group">
            {["interested", "not interested", "appointment"].map((type) => (
              <label key={type} className="radio-container">
                <input type="radio" name="type" value={type} required />
                <span className="radio-label">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group-horizontal">
          <div className="form-subgroup">
            <label>Date</label>
            <input type="date" name="date" className="form-input" required />
          </div>
          <div className="form-subgroup">
            <label>Time</label>
            <input type="time" name="time" className="form-input" required />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Follow-Up
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setSelectedMeetingForFollowUp(null)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{selectedMeetingForHistory && (
  <div className="followup-history-overlay">
    <div className="followup-history-modal">
      <div className="followup-history-header">
        <div className="header-content">
          <div className="client-info">
            <div className="client-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="client-details">
              <h3>{selectedMeetingForHistory.clientName || "Unnamed Client"}</h3>
              <p className="subtitle">Follow-up History</p>
            </div>
          </div>
          <button
            className="close-history-btn"
            onClick={() => {
              setSelectedMeetingForHistory(null);
              setFollowUpHistoryList([]);
            }}
          >
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
        ) : followUpHistoryList.length > 0 ? (
          <div className="history-timeline">
            {followUpHistoryList.map((history, index) => (
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
                          <span>
                            {new Date(history.follow_up_date || history.created_at).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {history.follow_up_time && (
                          <div className="time-info">
                            <FontAwesomeIcon icon={farClockRegular} />
                            <span>
                              {(() => {
                                const [h, m] = history.follow_up_time.split(":");
                                let hour = parseInt(h);
                                const ampm = hour >= 12 ? "PM" : "AM";
                                hour = hour % 12 || 12;
                                return `${hour}:${m} ${ampm}`;
                              })()}
                            </span>
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
                            <FontAwesomeIcon
                              icon={
                                history.connect_via === "call"
                                  ? faPhone
                                  : history.connect_via === "email"
                                  ? faEnvelope
                                  : history.connect_via === "video"
                                  ? faVideo
                                  : faComments
                              }
                            />
                            <span>{history.connect_via}</span>
                          </div>
                        )}

                        {history.follow_up_type && (
                          <div className="tag follow-up-type-tag">
                            <span>{history.follow_up_type}</span>
                          </div>
                        )}

                        {history.interaction_rating && (
                          <div
                            className={`tag rating-tag ${
                              history.interaction_rating.toLowerCase() === "hot"
                                ? "rating-hot"
                                : history.interaction_rating.toLowerCase() === "warm"
                                ? "rating-warm"
                                : history.interaction_rating.toLowerCase() === "cold"
                                ? "rating-cold"
                                : "rating-neutral"
                            }`}
                          >
                            <FontAwesomeIcon icon={faStar} />
                            <span>{history.interaction_rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="follow-up-reason">
                        <h4>Follow-Up Reason</h4>
                        <p>{history.comments || "No comments provided"}</p>
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
)}

    </div>
  );
};

export default ProcessScheduleMeeting;
