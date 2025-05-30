
import React, { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useApi } from "../../context/ApiContext";
import { isSameDay } from "../../utils/helpers";
import FollowUpForm from "./FollowUpForm";
import FollowUpHistory from "./FollowUpHistory";
import MeetingList from "./MeetingList";
import { SearchContext } from "../../context/SearchContext"; // ✅ added


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
    getAllFollowUps,
    updateClientLeadStatus, 
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
            return {
              ...meeting,
              leadId,
            };
          }
        })
      );

      const uniqueMeetings = enriched.reduce((unique, meeting) => {
        const existingMeeting = unique.find(
          (m) => String(m.leadId) === String(meeting.leadId) && m.leadId && meeting.leadId
        );

        if (!existingMeeting) {
          unique.push(meeting);
        } else {
          const existingStartTime = new Date(existingMeeting.startTime);
          const currentStartTime = new Date(meeting.startTime);
          if (currentStartTime > existingStartTime) {
            const index = unique.indexOf(existingMeeting);
            unique[index] = meeting;
          }
        }
        return unique;
      }, []);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const filtered = uniqueMeetings.filter((m) => {
        const start = new Date(m.startTime);
        if (recentlyUpdatedMeetingId && m.id === recentlyUpdatedMeetingId) return true;
        if (activeFilter === "today") {
          return isSameDay(start, now);
        }
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

    if (!freshLeadId) {
      Swal.fire({
        icon: "error",
        title: "Missing Lead ID",
        text: "Unable to find the lead ID. Please ensure the meeting data is correct and try again.",
      });
      return;
    }

    try {
      console.log("Submitting follow-up with data:", { ...formData, freshLeadId });

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

      if (followUpId) {
        await updateFollowUp(followUpId, payload);
        console.log("Follow-up updated with ID:", followUpId, "Payload:", payload);
      } else {
        const res = await createFollowUp(payload);
        followUpId = res.data.id;
        console.log("Follow-up created with ID:", followUpId, "Payload:", payload);
      }

      // Update ClientLead status to Follow-Up for specific follow-up types
      if (["interested", "not interested", "no response"].includes(follow_up_type)) {
        await updateClientLeadStatus(freshLeadId, "Follow-Up");
        console.log("ClientLead status updated to Follow-Up for freshLeadId:", freshLeadId);
      }

      await createFollowUpHistoryAPI({ ...payload, follow_up_id: followUpId });
      console.log("Follow-up history created for followUpId:", followUpId);

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

      let targetTab = "All Follow Ups";
      if (follow_up_type === "converted") {
        await createConvertedClientAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Client Converted Successfully!" });
        navigate("/customer", { state: { lead: leadDetails } });
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "close") {
        await createCloseLeadAPI({ fresh_lead_id: freshLeadId });
        Swal.fire({ icon: "success", title: "Lead Closed Successfully!" });
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
        setRecentlyUpdatedMeetingId(meeting.id);
        setMeetings((prev) =>
          prev.map((m) =>
            m.id === meeting.id
              ? {
                  ...m,
                  ...updated,
                  startTime: newStartTime,
                  interactionScheduleDate: follow_up_date,
                  interactionScheduleTime: follow_up_time,
                }
              : m
          )
        );
        Swal.fire({ icon: "success", title: "Meeting Updated Successfully!" });
        targetTab = "All Follow Ups";
      } else if (follow_up_type === "interested") {
        Swal.fire({
          icon: "success",
          title: "Lead Marked as Interested",
          text: "Lead has been moved to interested follow-ups and will appear in your follow-up list.",
        });
        targetTab = "Interested";
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "not interested") {
        Swal.fire({
          icon: "success",
          title: "Lead Marked as Not Interested",
          text: "Lead has been moved to not interested follow-ups.",
        });
        targetTab = "Not Interested";
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else if (follow_up_type === "no response") {
        Swal.fire({
          icon: "success",
          title: "Follow-Up Updated",
          text: "Lead marked as no response and moved to follow-ups.",
        });
        targetTab = "All Follow Ups";
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
      } else {
        Swal.fire({ icon: "success", title: "Follow-Up Updated Successfully!" });
        targetTab = "All Follow Ups";
      }

      await Promise.all([
        fetchFreshLeadsAPI(),
        refreshMeetings(),
        getAllFollowUps(),
      ]);
      console.log("Data refreshed after follow-up submission for type:", follow_up_type);

      navigate("/follow-up", {
        state: { lead: leadDetails, activeTab: targetTab },
      });
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
                <button
                  key={key}
                  className={activeFilter === key ? "active-filter" : ""}
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