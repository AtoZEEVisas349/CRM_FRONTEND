import React ,{useState, useEffect} from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";

const ReportCard = () => {
  const {
convertedClients,
fetchConvertedClientsAPI,
getAllFollowUps,
followUps,
freshLeads,
fetchFreshLeadsAPI
  } = useApi();
const[freshleadCounts,setFreshLeadCounts]=useState();
const[followupCounts,setFollowupCounts]=useState();
const[convertedCounts,setConvertedCounts]=useState();

const fetchAllCounts = async () => {
  try {
    const [freshLeads, followUps, convertedClients] = await Promise.all([
      fetchFreshLeadsAPI(),
      getAllFollowUps(),
      fetchConvertedClientsAPI(),
    ]);

    // Filter assigned fresh leads
    const assignedFreshLeads = freshLeads.data.filter(
      (lead) => lead.clientLead?.status === "New" ||
      lead.clientLead?.status === "Assigned"
    );
    setFreshLeadCounts(assignedFreshLeads.length);
    console.log("✅ Assigned Fresh Leads:", assignedFreshLeads);

    // Filter follow-up leads
    const followUpLeads = followUps.data.filter(
      (lead) => lead.clientLeadStatus === "Follow-Up"
    );
    setFollowupCounts(followUpLeads.length);
    console.log("✅ Follow-Up Leads:", followUpLeads);

    // Filter converted clients
    const filteredConvertedClients = convertedClients.filter(
      (client) => client.status === "Converted"
    );
    setConvertedCounts(filteredConvertedClients.length);
    console.log("✅ Converted Clients:", filteredConvertedClients);

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
      value:<div>{freshleadCounts ||0}</div>,
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Follow-ups",
         value:<div>{followupCounts||0}</div>,
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Converted Clients",
         value:<div>{convertedCounts||0}</div>,
      change: "-5.38%",
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="report-cards-exec">
      {cards.map((card, index) => (
        <div key={index} className={`report-card report-card-${index}`}>
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