import React, { useState, useEffect } from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";

const ReportCard = () => {
  const {
    fetchMeetings,
    fetchConvertedClientsAPI,
    getAllFollowUps,
    fetchFreshLeadsAPI,convertedCustomerCount
  } = useApi();

  const navigate = useNavigate();

  const [freshleadCounts, setFreshLeadCounts] = useState(0);
  const [followupCounts, setFollowupCounts] = useState(0);
  const [convertedCounts, setConvertedCounts] = useState(0);
  const [meetingsCount, setMeetings] = useState(0);

  const fetchFreshLeads = async () => {
    try {
      const freshLeads = await fetchFreshLeadsAPI();

      const assignedFreshLeads = freshLeads.data.filter(
        (lead) =>
          lead.clientLead?.status === "New" ||
          lead.clientLead?.status === "Assigned"
      );

      setFreshLeadCounts(assignedFreshLeads.length);
      console.log(assignedFreshLeads)
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
      console.log(assignedFollowup)
    } catch (error) {
      console.error("Failed to fetch fresh leads:", error);
    }
  };
    const fetchConverted = async () => {
    try {
      const converted = await fetchConvertedClientsAPI();

      const assignedConverted = converted.filter(
        (lead) =>
          lead.status === "Converted" 
        
      );

      setConvertedCounts(assignedConverted.length);
      console.log(assignedConverted)
    } catch (error) {
      console.error("Failed to fetch fresh leads:", error);
    }
  };

    const getMeetings = async () => {
    try {
      const meeting = await fetchMeetings();

      const assignedMeetings = meeting.filter(
        (lead) =>
         lead.clientLead.status === "Meeting" 
        
      );

      setMeetings(assignedMeetings.length);
      console.log(assignedMeetings)
    } catch (error) {
      console.error("Failed to fetch fresh leads:", error);
    }
  };
useEffect(()=>{
  getMeetings();
  fetchConverted();
  fetchFollowup();
  fetchFreshLeads();
},[])

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
      value: <div>{convertedCustomerCount}</div>, // ✅ use context count
      route: "/executive/customer",
      icon: <FaUsers />,
    },
    {
      title: "Scheduled Meetings",
      value: <div>{meetingsCount}</div>,
      route: "/executive/schedule",
      change: "-5.38%",
      icon: <FaUsers />,
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
          <div className="card-icon">{card.icon}</div>
          <div className="card-details">
            <h4>{card.title}</h4>
            <p className="card-value1">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportCard;
