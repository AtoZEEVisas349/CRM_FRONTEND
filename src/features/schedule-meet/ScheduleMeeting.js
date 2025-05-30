// pages/ScheduleMeeting.jsx
import React, { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import { SearchContext } from "../../context/SearchContext"; // ✅ added
import Swal from "sweetalert2";
import { useApi } from "../../context/ApiContext";
import { isSameDay } from "../../utils/helpers";
import FollowUpForm from "./FollowUpForm";
import FollowUpHistory from "./FollowUpHistory";
import MeetingList from "./MeetingList";

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
    createCloseLeadAPI
  } = useApi();
  const { searchQuery } = useContext(SearchContext); // ✅ get query

  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [selectedMeetingForHistory, setSelectedMeetingForHistory] = useState(null);
  const [selectedMeetingForFollowUp, setSelectedMeetingForFollowUp] = useState(null);
  const [recentlyUpdatedMeetingId, setRecentlyUpdatedMeetingId] = useState(null);

  const loadMeetings = async () => {
    try {
      const allMeetings = await fetchMeetings();
      if (!Array.isArray(allMeetings)) {
        setMeetings([]);
        return;
      }

      const filteredByStatus = allMeetings.filter((m) => m?.clientLead?.status === "Meeting");

      const enriched = await Promise.all(
        filteredByStatus.map(async (meeting) => {
          const leadId =
            meeting.fresh_lead_id ||
            meeting.freshLead?.id ||
            meeting.clientLead?.freshLead?.id ||
            meeting.clientLead?.fresh_lead_id ||
            meeting.freshLead?.lead?.id ||
            meeting.id;

          try {
            const histories = await fetchFollowUpHistoriesAPI();
            const recent = histories
              .filter((h) => String(h.fresh_lead_id) === String(leadId))
              .sort((a, b) => new Date(b.created_at || b.follow_up_date) - new Date(a.created_at || a.follow_up_date))[0];

            return {
              ...meeting,
              leadId, // Add leadId for duplicate filtering
              interactionScheduleDate: recent?.follow_up_date,
              interactionScheduleTime: recent?.follow_up_time,
              followUpDetails: recent
            };
          } catch {
            return {
              ...meeting,
              leadId // Add leadId even if history fetch fails
            };
          }
        })
      );

      // Remove duplicates based on fresh_lead_id, keeping the most recent meeting
      const uniqueMeetings = enriched.reduce((unique, meeting) => {
        const existingMeeting = unique.find(m => 
          String(m.leadId) === String(meeting.leadId) && m.leadId && meeting.leadId
        );
        
        if (!existingMeeting) {
          unique.push(meeting);
        } else {
          // Keep the meeting with the most recent startTime
          const existingStartTime = new Date(existingMeeting.startTime);
          const currentStartTime = new Date(meeting.startTime);
          
          if (currentStartTime > existingStartTime) {
            // Replace the existing meeting with the more recent one
            const index = unique.indexOf(existingMeeting);
            unique[index] = meeting;
          }
        }
        
        return unique;
      }, []);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
      
      const filtered = uniqueMeetings.filter((m) => {
        const start = new Date(m.startTime);
        
        // Always show recently updated meetings regardless of filter
        if (recentlyUpdatedMeetingId && m.id === recentlyUpdatedMeetingId) return true;
        
        if (activeFilter === "today") {
          // Show meetings for today only (current date)
          return isSameDay(start, now);
        }
        
        if (activeFilter === "week") {
          // Show meetings for the next 7 days (including today)
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          return start >= today && start < weekFromNow;
        }
        
        if (activeFilter === "month") {
          // Show meetings for the next 30 days (including today)
          const monthFromNow = new Date(today);
          monthFromNow.setDate(today.getDate() + 30);
          return start >= today && start < monthFromNow;
        }
        
        return true;
      });

    // ✅ Filter meetings using searchQuery
    const query = searchQuery.toLowerCase();
    const searchFiltered = filtered.filter((m) => {
      return (
        m.clientName?.toLowerCase().includes(query) ||
        m.clientEmail?.toLowerCase().includes(query) ||
        m.clientPhone?.toString().includes(query)
      );
    });

    setMeetings(searchFiltered);
  } catch (error) {
    console.error("Failed to load meetings:", error);
    setMeetings([]);
  }};
  const handleFollowUpSubmit = async (formData) => {
    const {
      clientName,
      email,
      reason_for_follow_up,
      connect_via,
      follow_up_type,
      interaction_rating,
      follow_up_date,
      follow_up_time,
    } = formData;
  
    const meeting = selectedMeetingForFollowUp;
  
    const freshLeadId =
      meeting.fresh_lead_id ||
      meeting.freshLead?.id ||
      meeting.clientLead?.freshLead?.id ||
      meeting.clientLead?.fresh_lead_id ||
      meeting.freshLead?.lead?.id ||
      meeting.id ||
      meeting.clientLead?.id;
  
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
      const histories = await fetchFollowUpHistoriesAPI();
      if (Array.isArray(histories)) {
        const recent = histories
          .filter((h) => String(h.fresh_lead_id) === String(freshLeadId))
          .sort((a, b) => new Date(b.created_at || b.follow_up_date) - new Date(a.created_at || a.follow_up_date))[0];
        followUpId = recent?.follow_up_id;
      }
  
      const payload = {
        connect_via,
        follow_up_type,
        interaction_rating,
        reason_for_follow_up,
        follow_up_date,
        follow_up_time,
        fresh_lead_id: freshLeadId,
      };
  
      if (followUpId) {
        await updateFollowUp(followUpId, payload);
      } else {
        const res = await createFollowUp(payload);
        followUpId = res.data.id;
      }
  
      await createFollowUpHistoryAPI({ ...payload, follow_up_id: followUpId });
  
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
        await createConvertedClientAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Client Converted" });
        navigate("/customer", { state: { lead: leadDetails } });
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "close") {
        await createCloseLeadAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Lead Closed" });
        navigate("/close-leads", { state: { lead: leadDetails } });
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "appointment") {
        const newStartTime = new Date(`${follow_up_date}T${follow_up_time}`).toISOString();
        
        const updated = await updateMeetingAPI(meeting.id, {
          clientName,
          clientEmail: email,
          clientPhone: meeting.clientPhone,
          reasonForFollowup: reason_for_follow_up,
          startTime: newStartTime,
          endTime: meeting.endTime || null,
          fresh_lead_id: freshLeadId,
        });
        
        // Set the recently updated meeting ID to ensure it shows in the UI
        setRecentlyUpdatedMeetingId(meeting.id);
        
        setMeetings((prev) =>
          prev.map((m) =>
            m.id === meeting.id
              ? {
                  ...m,
                  ...updated,
                  startTime: newStartTime, // Update the startTime for date display
                  interactionScheduleDate: follow_up_date,
                  interactionScheduleTime: follow_up_time,
                }
              : m
          )
        );
        Swal.fire({ icon: "success", title: "Meeting Updated" });
      } else {
        Swal.fire({ icon: "success", title: "Follow-Up Updated" });
        navigate("/follow-up", { state: { lead: leadDetails } });
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      }
  
      await fetchFreshLeadsAPI();
      await refreshMeetings();
      await loadMeetings();
      handleCloseFollowUpForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Something went wrong. Please try again.",
      });
    }
  };
  

  const handleAddFollowUp = (meeting) => setSelectedMeetingForFollowUp(meeting);
  const handleCloseFollowUpForm = () => setSelectedMeetingForFollowUp(null);

  const handleShowHistory = (meeting) => setSelectedMeetingForHistory(meeting);
  const handleCloseHistory = () => setSelectedMeetingForHistory(null);

 
  useEffect(() => {
    loadMeetings();
  }, [activeFilter, searchQuery]); // ✅ reload if search changes


  return (
    <div className="task-management-container">
      <div className="task-management-wrapper">
        <div className="content-header">
          <div className="header-top">
            <div className="header-left">
              <h2 className="meetings-title">Your Meetings</h2>
              <div className="date-section">
                <p className="day-name">{new Date().toLocaleDateString(undefined, { weekday: "long" })}</p>
                <p className="current-date">{new Date().toLocaleDateString(undefined, { day: "numeric", month: "long" })}</p>
                <FontAwesomeIcon icon={faChevronDown} className="date-dropdown" />
              </div>
            </div>
            <div className="filter-controls">
              {["today", "week", "month"].map((key) => (
                <button key={key} className={activeFilter === key ? "active-filter" : ""} onClick={() => setActiveFilter(key)}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
              <button className="refresh-button" onClick={loadMeetings}>
                <FontAwesomeIcon icon={faSyncAlt} />
              </button>
            </div>
          </div>
        </div>

        <div className="meetings-content">
          <MeetingList meetings={meetings} onAddFollowUp={handleAddFollowUp} onShowHistory={handleShowHistory} />
        </div>
      </div>

      {selectedMeetingForFollowUp && (
        <FollowUpForm
          meeting={selectedMeetingForFollowUp}
          onClose={handleCloseFollowUpForm}
          onSubmit={handleFollowUpSubmit}
        />
      )}

      {selectedMeetingForHistory && (
        <FollowUpHistory
          meeting={selectedMeetingForHistory}
          onClose={handleCloseHistory}
        />
      )}
    </div>
  );
};

export default ScheduleMeeting;