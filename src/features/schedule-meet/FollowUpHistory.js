// components/FollowUpHistory.jsx
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { useApi } from "../../context/ApiContext";
import { getComparableDateTime } from "../../utils/helpers";
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
export default FollowUpHistory;  