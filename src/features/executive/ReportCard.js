import React, { useState, useEffect } from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";

const ReportCard = () => {
  const { counts, fetchCounts } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCounts(); // Assuming it updates context state
      } catch (error) {
        console.error("❌ Failed to fetch counts from context:", error);
      }
    };

    fetchData(); // fire on mount
  }, []);

  if (!counts) return <p>Loading report data...</p>;

  const cards = [
    {
      title: "Fresh Leads",
      value: <div>{counts.freshLeads || 0}</div>,
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Follow-ups",
      value: <div>{counts.followUps || 0}</div>,
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Converted Clients",
      value: <div>{counts.convertedClients || 0}</div>,
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
