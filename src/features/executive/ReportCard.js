import React from "react";
import { FaUserPlus, FaClipboardCheck, FaUsers } from "react-icons/fa";

const ReportCard = () => {
  const cards = [
    {
      title: "Total Income",
      value: "$348,261",
      change: "+3.85%",
      icon: <FaUserPlus />,
    },
    {
      title: "Profit",
      value: "$15,708.98",
      change: "+6.41%",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Total Revenue",
      value: "7.415.644",
      change: "-5.38%",
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="report-cards">
      {cards.map((card, index) => (
        <div key={index} className={`report-card report-card-${index}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-details">
            <h4>{card.title}</h4>
            <p className="card-value">{card.value}</p>
            <p
              className={`card-change ${card.change.includes("-") ? "negative" : "positive"
                }`}
            >
              {card.change} Compared to last month
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportCard;
