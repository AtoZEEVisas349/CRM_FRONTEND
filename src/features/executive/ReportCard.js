import React, { useState, useEffect } from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";

const ReportCard = () => {
  const {
    fetchMeetings,
    fetchConvertedClientsAPI,
    getAllFollowUps,
    fetchFreshLeadsAPI,
    executiveInfo
  } = useApi();

  const navigate = useNavigate();

  const [freshleadCounts, setFreshLeadCounts] = useState(0);
  const [followupCounts, setFollowupCounts] = useState(0);
  const [convertedCounts, setConvertedCounts] = useState(0);
  const [meetingsCount, setMeetings] = useState(0);
  const [missedMeetingsCount, setMissedMeetingsCount] = useState(0);

  const fetchFreshLeads = async () => {
    try {
      const freshLeads = await fetchFreshLeadsAPI();

      const assignedFreshLeads = freshLeads.data.filter(
        (lead) =>
          lead.clientLead?.status === "New" ||
          lead.clientLead?.status === "Assigned"
      );

      setFreshLeadCounts(assignedFreshLeads.length);
      console.log(assignedFreshLeads);
    } catch (error) {
      console.error("Failed to fetch fresh leads:", error);
    }
  };

  const fetchFollowup = async () => {
    try {
      const followup = await getAllFollowUps();

      const assignedFollowup = followup.data.filter(
        (lead) =>
          lead.clientLeadStatus === "Follow-Up" 
      );

      setFollowupCounts(assignedFollowup.length);
      console.log(assignedFollowup);
    } catch (error) {
      console.error("Failed to fetch followups:", error);
    }
  };

  const fetchConverted = async () => {
    try {
      const executiveId = executiveInfo?.id;
      if (!executiveId) {
        console.error("No executive ID found!");
        setConvertedCounts(0);
        return;
      }

      const converted = await fetchConvertedClientsAPI(executiveId);

      const assignedConverted = converted.filter(
        (lead) =>
          lead.status === "Converted" 
      );

      setConvertedCounts(assignedConverted.length);
      console.log(assignedConverted);
    } catch (error) {
      console.error("Failed to fetch converted clients:", error);
      setConvertedCounts(0);
    }
  };

  const getMeetings = async () => {
    try {
      const meeting = await fetchMeetings();
      const currentDateTime = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999); // End of today

      // Filter meetings with "Meeting" status
      const meetingsWithStatus = meeting.filter(
        (lead) => lead.clientLead?.status === "Meeting"
      );

      // Separate today's meetings and future meetings
      const todaysMeetings = meetingsWithStatus.filter((lead) => {
        if (!lead.startTime) return false;
        const meetingDate = new Date(lead.startTime);
        return meetingDate >= today && meetingDate <= endOfToday;
      });

      const futureMeetings = meetingsWithStatus.filter((lead) => {
        if (!lead.startTime) return false;
        const meetingDate = new Date(lead.startTime);
        return meetingDate > endOfToday;
      });

      // Count missed meetings (today's meetings that have passed)
      const missedTodayMeetings = todaysMeetings.filter((lead) => {
        const meetingDate = new Date(lead.startTime);
        return meetingDate < currentDateTime;
      });

      // Count upcoming meetings (today's meetings that haven't happened yet + future meetings)
      const upcomingTodayMeetings = todaysMeetings.filter((lead) => {
        const meetingDate = new Date(lead.startTime);
        return meetingDate >= currentDateTime;
      });

      // Combine upcoming today's meetings with future meetings
      const allUpcomingMeetings = [...upcomingTodayMeetings, ...futureMeetings];

      // Group by fresh_lead_id and keep only the latest meeting for each fresh_lead_id
      const meetingsByFreshLeadId = {};
      const missedMeetingsByFreshLeadId = {};
      
      // Process upcoming meetings
      allUpcomingMeetings.forEach((meeting) => {
        const freshLeadId = meeting.freshLead?.id;
        
        if (!freshLeadId) return;
        
        if (!meetingsByFreshLeadId[freshLeadId]) {
          meetingsByFreshLeadId[freshLeadId] = meeting;
        } else {
          const existingMeetingDate = new Date(meetingsByFreshLeadId[freshLeadId].startTime);
          const currentMeetingDate = new Date(meeting.startTime);
          
          if (currentMeetingDate > existingMeetingDate) {
            meetingsByFreshLeadId[freshLeadId] = meeting;
          }
        }
      });

      // Process missed meetings
      missedTodayMeetings.forEach((meeting) => {
        const freshLeadId = meeting.freshLead?.id;
        
        if (!freshLeadId) return;
        
        if (!missedMeetingsByFreshLeadId[freshLeadId]) {
          missedMeetingsByFreshLeadId[freshLeadId] = meeting;
        } else {
          const existingMeetingDate = new Date(missedMeetingsByFreshLeadId[freshLeadId].startTime);
          const currentMeetingDate = new Date(meeting.startTime);
          
          if (currentMeetingDate > existingMeetingDate) {
            missedMeetingsByFreshLeadId[freshLeadId] = meeting;
          }
        }
      });

      // Count unique meetings
      const uniqueMeetingsCount = Object.keys(meetingsByFreshLeadId).length;
      const uniqueMissedMeetingsCount = Object.keys(missedMeetingsByFreshLeadId).length;
      
      setMeetings(uniqueMeetingsCount);
      setMissedMeetingsCount(uniqueMissedMeetingsCount);
      
      console.log("Filtered upcoming meetings:", Object.values(meetingsByFreshLeadId));
      console.log("Total unique upcoming meetings:", uniqueMeetingsCount);
      console.log("Filtered missed meetings:", Object.values(missedMeetingsByFreshLeadId));
      console.log("Total unique missed meetings:", uniqueMissedMeetingsCount);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    }
  };

  useEffect(() => {
    getMeetings();
    fetchConverted();
    fetchFollowup();
    fetchFreshLeads();
  }, [executiveInfo]);

  const cards = [
    {
      title: "Fresh Leads",
      value: <div>{freshleadCounts}</div>,
      route: "/executive/freshlead",
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Follow-ups",
      value: <div>{followupCounts}</div>,
      route: "/executive/follow-up",
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Converted Clients",
      value: <div>{convertedCounts}</div>,
      route: "/executive/customer",
      icon: <FaUsers />,
    },
    {
      title: "Scheduled Meetings",
      value: <div>{meetingsCount}</div>,
      route: "/executive/schedule",
      change: "-5.38%",
      icon: <FaUsers />,
      missedCount: missedMeetingsCount,
    },
  ];

  return (
    <div className="report-cards-exec">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`report-card report-card-${index}`}
          onClick={() => navigate(card.route)}
        >
          <div className="bubble-small bubble-1"></div>
          <div className="bubble-small bubble-2"></div>
          <div className="bubble-small bubble-3"></div>
          <div className="bubble-small bubble-4"></div>
          <div className="card-icon">{card.icon}</div>
          <div className="card-details">
            <h4>{card.title}</h4>
            <p className="card-value1">{card.value}</p>
          </div>
          {card.missedCount !== undefined && card.missedCount > 0 && (
            <div className="missed-meetings-badge">
              <FaExclamationTriangle className="missed-icon" />
              <span className="missed-count">Missed {card.missedCount} meeting</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReportCard;