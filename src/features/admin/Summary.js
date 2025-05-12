import React, { useState } from "react";
import { FaCamera, FaFileAlt, FaDollarSign, FaChartBar } from "react-icons/fa";
import "../../styles/admin.css";

const Summary = () => {
  const [activeBox, setActiveBox] = useState(null);

  const handleBoxClick = (index) => {
    setActiveBox(activeBox === index ? null : index);
  };

  const summaryItems = [
    {
      icon: <FaCamera className="box-icon" />,
      title: "5 Leads",
      subtitle: "9 Closed Deals"
    },
    {
      icon: <FaFileAlt className="box-icon" />,
      title: "20",
      subtitle: "New Deals"
    },
    {
      icon: <FaDollarSign className="box-icon" />,
      title: "$20K",
      subtitle: "Est. Revenue"
    },
    {
      icon: <FaChartBar className="box-icon" />,
      title: "$10K",
      subtitle: "Est. Profit"
    }
  ];

  return (
    <div className="summary">
      {summaryItems.map((item, index) => (
        <div 
          key={index}
          className={`box box-hover-${index} ${activeBox === index ? 'active' : ''}`}
          onClick={() => handleBoxClick(index)}
        >
          <div className="box-content">
            {item.icon}
            <div>
            <h3 className={`box-title title-${index}`}>{item.title}</h3>
            <small>{item.subtitle}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Summary;