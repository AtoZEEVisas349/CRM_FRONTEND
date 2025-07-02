import React, { useState, useEffect } from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { isSameDay } from "../../utils/helpers";
import { useProcessService } from "../../context/ProcessServiceContext";
const ProcessReportCard = () => {
  
 const {
    customers,
    setCustomers,
    fetchCustomers,
  getProcessPersonMeetings
  } = useProcessService();
  const navigate = useNavigate();
  const [freshLeadCount,setFreshLeadCount]=useState();
  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        // If data returned from fetchConvertedClients is the raw clients array
        if (data && Array.isArray(data)) {
             const mappedClients = data
  .filter((client) => client.status === "pending")
          setFreshLeadCount(mappedClients);
        }
      })
      
       
      .catch((err) => {
        console.error("❌ Error fetching clients:", err);
      });
  }, []);
  const[meetingData,setMeetingData]=useState();
const loadMeetings = async () => {

  try {
    const response = await getProcessPersonMeetings();

    // Filter only meetings where status is "meeting"
    const allMeetings = response.filter(
      (m) => m?.freshLead?.CustomerStatus?.status === "meeting"
    );

    // Get unique meetings based on fresh_lead_id
    const uniqueMeetingsMap = new Map();
    allMeetings.forEach((meeting) => {
      const leadId = meeting.fresh_lead_id;
      if (!uniqueMeetingsMap.has(leadId)) {
        uniqueMeetingsMap.set(leadId, meeting);
      }
    });

    const uniqueMeetings = Array.from(uniqueMeetingsMap.values());

    // Get today's date
    const today = new Date();

    // Count how many meetings are scheduled for today
    const todayCount = uniqueMeetings.filter((m) =>
      isSameDay(new Date(m.startTime), today)
    ).length;

    // Set that count
    setMeetingData(todayCount); // or rename this state to `setTodayMeetingCount` for clarity
  } catch (err) {
    console.error("Failed to fetch process meetings", err);
  } finally {
   
  }
};

     useEffect(() => {
        loadMeetings();
      }, []);
     
  const freshLeadCountData= customers
  .filter((client) => client.status === "pending")
   const followupCountData= customers
  .filter((client) => client.status === "under_review")
   const finalStageData= customers
  .filter((client) => client.status === "approved")
 

  const cards = [
    {
      title: "Fresh Leads",
      value: <div>{freshLeadCountData.length}</div>,
      route: "/process/freshlead",
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Follow-ups",
      value: <div>{followupCountData.length}</div>,
      route: "/process/process-follow-up/",
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
  
    {
      title: "Scheduled Meetings",
      value: <div>{meetingData||0}</div>,
      route: "/process/schedule",
      change: "-5.38%",
      icon: <FaUsers />,
    },
      {
      title: "Final Stage",
      value: <div>{finalStageData.length}</div>, // ✅ use context count
      route: "/process/finalstage-leads",
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
