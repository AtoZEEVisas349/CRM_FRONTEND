import React, { useState, useEffect } from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { useProcessService } from "../../context/ProcessServiceContext";
const ProcessReportCard = () => {
  const {
    fetchMeetings,
    fetchConvertedClientsAPI,
    getAllFollowUps,
    fetchFreshLeadsAPI,
    convertedCustomerCount
  } = useApi();
 const {
    customers,
    setCustomers,
    fetchCustomers,
    // Assuming you have this setter exposed from context
  } = useProcessService();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        // If data returned from fetchConvertedClients is the raw clients array
        if (data && Array.isArray(data)) {
          const mappedClients = data.map((client) => ({
            ...client,
            id: client.id || client._id, // prefer id, fallback to _id
          }));
          setCustomers(mappedClients);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching clients:", err);
      });
  }, []);
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
      console.error("Failed to fetch followups:", error);
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
      console.error("Failed to fetch converted clients:", error);
    }
  };

  const getMeetings = async () => {
    try {
      const meeting = await fetchMeetings();
      const currentDateTime = new Date();

      // Filter meetings with "Meeting" status and future dates only
      const meetingsWithStatus = meeting.filter(
        (lead) => lead.clientLead?.status === "Meeting"
      );

      // Filter out past meetings
      const futureMeetings = meetingsWithStatus.filter((lead) => {
        if (!lead.startTime) return false;
        const meetingDate = new Date(lead.startTime);
        return meetingDate > currentDateTime;
      });

      // Group by fresh_lead_id and keep only the latest meeting for each fresh_lead_id
      const meetingsByFreshLeadId = {};
      
      futureMeetings.forEach((meeting) => {
        const freshLeadId = meeting.freshLead?.id;
        
        if (!freshLeadId) return; // Skip if no fresh_lead_id
        
        if (!meetingsByFreshLeadId[freshLeadId]) {
          meetingsByFreshLeadId[freshLeadId] = meeting;
        } else {
          // Compare dates and keep the latest one
          const existingMeetingDate = new Date(meetingsByFreshLeadId[freshLeadId].startTime);
          const currentMeetingDate = new Date(meeting.startTime);
          
          if (currentMeetingDate > existingMeetingDate) {
            meetingsByFreshLeadId[freshLeadId] = meeting;
          }
        }
      });

      // Count unique meetings
      const uniqueMeetingsCount = Object.keys(meetingsByFreshLeadId).length;
      
      setMeetings(uniqueMeetingsCount);
      console.log("Filtered meetings:", Object.values(meetingsByFreshLeadId));
      console.log("Total unique future meetings:", uniqueMeetingsCount);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    }
  };

  useEffect(() => {
    getMeetings();
    fetchConverted();
    fetchFollowup();
    fetchFreshLeads();
  }, [])

  const cards = [
    {
      title: "Fresh Leads",
      value: <div>{customers.length}</div>,
      route: "/process/freshlead",
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Follow-ups",
      value: <div>{followupCounts}</div>,
      route: "/process/follow-up",
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Converted Clients",
      value: <div>{convertedCustomerCount}</div>, // ✅ use context count
      route: "/process/customer",
      icon: <FaUsers />,
    },
    {
      title: "Scheduled Meetings",
      value: <div>{meetingsCount}</div>,
      route: "/process/schedule",
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

export default ProcessReportCard;