import React, { useState, useEffect } from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";

const ReportCard = () => {
  const {
    fetchMeetings,
    fetchConvertedClientsAPI,
    getAllFollowUps,
    fetchFreshLeadsAPI
  } = useApi();

  const navigate = useNavigate();

  const [freshleadCounts, setFreshLeadCounts] = useState(0);
  const [followupCounts, setFollowupCounts] = useState(0);
  const [convertedCounts, setConvertedCounts] = useState(0);
  const [meetingsCount, setMeetings] = useState(0);

  const fetchAllCounts = async () => {
    try {
      const [freshLeads, followUps, convertedClients, meetings] = await Promise.all([
        fetchFreshLeadsAPI(),
        getAllFollowUps(),
        fetchConvertedClientsAPI(),
        fetchMeetings()
      ]);

      const assignedFreshLeads = freshLeads.data.filter(
        (lead) =>
          lead.clientLead?.status === "New" ||
          lead.clientLead?.status === "Assigned"
      );
      setFreshLeadCounts(assignedFreshLeads.length);

      const followUpLeads = followUps.data.filter(
        (lead) => lead.clientLeadStatus === "Follow-Up"
      );
      setFollowupCounts(followUpLeads.length);

      const filteredConvertedClients = convertedClients.filter(
        (client) => client.status === "Converted"
      );
      setConvertedCounts(filteredConvertedClients.length);

      const filteredMeetingCount = meetings.filter(
        (client) => client.clientLead.status === "Meeting"
      );
      setMeetings(filteredMeetingCount.length);

    } catch (error) {
      console.error("❌ Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);

  const cards = [
    {
      title: "Fresh Leads",
      value: <div>{freshleadCounts}</div>,
      route: "/freshlead",
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Follow-ups",
      value: <div>{followupCounts}</div>,
      route: "/follow-up",
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Converted Clients",
      value: <div>{convertedCounts}</div>,
      route: "/customer",
      change: "-5.38%",
      icon: <FaUsers />,
    },
    {
      title: "Scheduled Meetings",
      value: <div>{meetingsCount}</div>,
      route: "/schedule",
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
