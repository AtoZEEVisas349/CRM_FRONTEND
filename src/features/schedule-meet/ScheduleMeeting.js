

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useApi } from "../../context/ApiContext";
import { isSameDay } from "../../utils/helpers";
import FollowUpForm from "./FollowUpForm";
import FollowUpHistory from "./FollowUpHistory";
import MeetingList from "./MeetingList";
import { SearchContext } from "../../context/SearchContext";
import { useLoading } from "../../context/LoadingContext";
import LoadingSpinner from "../spinner/LoadingSpinner";

const ScheduleMeeting = () => {
  const {
    fetchMeetings,
    fetchFollowUpHistoriesAPI,
    updateFollowUp,
    createFollowUp,
    createFollowUpHistoryAPI,
    fetchFreshLeadsAPI,
    refreshMeetings,
    createConvertedClientAPI,
    createCloseLeadAPI,
    getAllFollowUps,
    updateClientLead,
  } = useApi();

  const { searchQuery } = useContext(SearchContext);
  const [localLoading, setLocalLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [meetings, setMeetings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [selectedMeetingForHistory, setSelectedMeetingForHistory] = useState(null);
  const [selectedMeetingForFollowUp, setSelectedMeetingForFollowUp] = useState(null);

  const loadMeetings = async () => {
    try {
      setLocalLoading(true);
      const allMeetings = await fetchMeetings();

      if (!Array.isArray(allMeetings)) {
        setMeetings([]);
        return;
      }

      const filteredByStatus = allMeetings.filter(
        (m) => m?.clientLead?.status === "Meeting"
      );

      const enriched = await Promise.all(
        filteredByStatus.map(async (meeting) => {
          const leadId =
            meeting.fresh_lead_id ||
            meeting.freshLead?.id ||
            meeting.clientLead?.freshLead?.id ||
            meeting.clientLead?.fresh_lead_id ||
            meeting.freshLead?.lead?.id ||
            meeting.id ||
            meeting.clientLead?.id;

          try {
            const histories = await fetchFollowUpHistoriesAPI();
            const recent = histories
              .filter((h) => String(h.fresh_lead_id) === String(leadId))
              .sort(
                (a, b) =>
                  new Date(b.created_at || b.follow_up_date) -
                  new Date(a.created_at || a.follow_up_date)
              )[0];

            return {
              ...meeting,
              leadId,
              interactionScheduleDate: recent?.follow_up_date,
              interactionScheduleTime: recent?.follow_up_time,
              followUpDetails: recent,
            };
          } catch {
            return { ...meeting, leadId };
          }
        })
      );

      const uniqueMeetings = enriched.reduce((unique, meeting) => {
        const exists = unique.find(
          (m) => String(m.leadId) === String(meeting.leadId)
        );
        if (!exists) {
          unique.push(meeting);
        } else {
          const oldDate = new Date(exists.startTime);
          const newDate = new Date(meeting.startTime);
          if (newDate > oldDate) {
            const index = unique.indexOf(exists);
            unique[index] = meeting;
          }
        }
        return unique;
      }, []);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const filtered = uniqueMeetings.filter((m) => {
        const start = new Date(m.startTime);
        if (activeFilter === "today") return isSameDay(start, now);
        if (activeFilter === "week") {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          return start >= today && start < weekFromNow;
        }
        if (activeFilter === "month") {
          const monthFromNow = new Date(today);
          monthFromNow.setDate(today.getDate() + 30);
          return start >= today && start < monthFromNow;
        }
        return true;
      });

      const query = searchQuery.toLowerCase();
      const searchFiltered = filtered.filter((m) =>
        [m.clientName, m.clientEmail, m.clientPhone?.toString()]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query))
      );

      setMeetings(searchFiltered);
    } catch (error) {
      console.error("Failed to load meetings:", error);
      setMeetings([]);
    } finally {
      setLocalLoading(false);
    }
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
  
    const clientLeadId = meeting.clientLead?.id;
  
    if (!freshLeadId || !clientLeadId) {
      Swal.fire({
        icon: "error",
        title: "Missing Lead Info",
        text: "Unable to find the lead ID or client lead ID.",
      });
      return;
    }
  
    try {
      let followUpId;
      const histories = await fetchFollowUpHistoriesAPI();
      if (Array.isArray(histories)) {
        const recent = histories
          .filter((h) => String(h.fresh_lead_id) === String(freshLeadId))
          .sort(
            (a, b) =>
              new Date(b.created_at || b.follow_up_date) -
              new Date(a.created_at || a.follow_up_date)
          )[0];
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
  
      // Create or update follow-up
      if (followUpId) {
        await updateFollowUp(followUpId, payload);
      } else {
        const res = await createFollowUp(payload);
        followUpId = res.data.id;
      }
  
      // Update client lead status for specific follow-up types
      if (["interested", "not interested", "no response"].includes(follow_up_type)) {
        await updateClientLead(clientLeadId, {
          status: "Follow-Up",
          companyId: meeting.clientLead?.companyId,
        });
      }
  
      // Always create follow-up history before any navigation
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
  
      // Handle specific follow-up types that require special API calls
      if (follow_up_type === "converted") {
        await createConvertedClientAPI({ fresh_lead_id: freshLeadId });
      } else if (follow_up_type === "close") {
        await createCloseLeadAPI({ fresh_lead_id: freshLeadId });
      }
  
      // Remove meeting from the list
      setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
  
      // Refresh data
      await Promise.all([
        fetchFreshLeadsAPI(),
        refreshMeetings(),
        getAllFollowUps(),
      ]);
  
      // Handle navigation and success messages based on follow-up type
      if (follow_up_type === "converted") {
        Swal.fire({ icon: "success", title: "Client Converted Successfully!" });
        navigate("/customer", { state: { lead: leadDetails } });
      } else if (follow_up_type === "close") {
        Swal.fire({ icon: "success", title: "Lead Closed Successfully!" });
        navigate("/close-leads", { state: { lead: leadDetails } });
      } else {
        // For all other follow-up types (interested, not interested, no response, appointment, etc.)
        const targetTab = "All Follow Ups";
        navigate("/follow-up", {
          state: { lead: leadDetails, activeTab: targetTab },
        });
      }
  
      handleCloseFollowUpForm();
    } catch (error) {
      console.error("Follow-up submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error.message || "Something went wrong. Please try again.",
      });
    }
  };
  
  const handleAddFollowUp = (meeting) => setSelectedMeetingForFollowUp(meeting);
  const handleCloseFollowUpForm = () => setSelectedMeetingForFollowUp(null);
  const handleShowHistory = (meeting) => setSelectedMeetingForHistory(meeting);
  const handleCloseHistory = () => setSelectedMeetingForHistory(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadMeetings();
  }, [activeFilter, searchQuery]);

  return (
    <div className="task-management-container">
      {localLoading && <LoadingSpinner text="Loading Meetings..." />}
      <div className="task-management-wrapper">
        <div className="content-header">
          <div className="header-top">
            <div className="header-left">
              <h2 className="meetings-title">Your Meetings</h2>
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
                  disabled={localLoading}
                                  >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="meetings-content">
          <MeetingList
            meetings={meetings}
            onAddFollowUp={handleAddFollowUp}
            onShowHistory={handleShowHistory}
          />
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




