import React from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";

const ReportCard = () => {
  const {
    freshLeadsCount,
    followUpCount,
    convertedClientsCount,
  } = useApi();

  const cards = [
    {
      title: "Fresh Leads",
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Follow-ups",
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Converted Clients",
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
