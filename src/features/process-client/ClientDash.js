import React, { useState } from 'react';
import roadMapImage from "../../assets/roadMapImage.jpeg";

const iconPositions = [
    { top: "25%", left: "22.5%" },  
    { top: "78%", left: "29.7%" },    
    { top: "20%", left: "36.7%" },    
    { top: "72%", left: "44.1%" },  
    { top: "14%", left: "50.5%" },    
    { top: "73%", left: "57.5%" },   
    { top: "19%", left: "64.5%" },
    { top: "78%", left: "71.3%" },
    { top: "24%", left: "79%" }
];

const ClientDash = () => {
  const editableStages = 9;
  const [comments, setComments] = useState(Array(iconPositions.length).fill({ text: "", date: "" }));
  const [activeIcon, setActiveIcon] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleIconClick = (index) => {
    if (index < editableStages) {
      setActiveIcon(index);
      setInputValue(comments[index].text);
    }
  };

  const handleSubmit = () => {
    const currentDate = new Date();
    const monthYear = currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });

    const updatedComments = [...comments];
    updatedComments[activeIcon] = { text: inputValue, date: monthYear };
    setComments(updatedComments);
    setActiveIcon(null);
  };

  const getColor = (index) => {
    const colors = [
      "#f2a900", "#e74c3c", "#2ecc71",
      "#3498db", "#9b59b6", "#e67e22",
      "#1abc9c", "#ccd61d", "#ef1a93"
    ];
    return colors[index] || "#000";
  };

  return (
    <div className="page-wrapper">
      {/* Roadmap Top */}
      <div className="roadmap-container">
        <h1>Activity Roadmap</h1>
        <div className="process-image-wrapper">
          <img src={roadMapImage} alt="Roadmap" className="roadmap-image" />
          {iconPositions.map((pos, index) => (
            <div
              key={index}
              className="icon-container"
              style={{ top: pos.top, left: pos.left }}
            >
              <button
                className={`hex-button hex-icon-${index}`}
                onClick={() => handleIconClick(index)}
                disabled={index >= editableStages}
                style={{ cursor: index >= editableStages ? "default" : "pointer" }}
              >
                <div className="hex-text">
                  {index < editableStages ? (
                    <>
                      <small>Stage</small>
                      <small>{index + 1}</small>
                    </>
                  ) : (
                    <>
                      <small>{comments[index].text ? comments[index].date.split(" ")[0] : "—"}</small>
                      <small>{comments[index].text ? comments[index].date.split(" ")[1] : "—"}</small>
                    </>
                  )}
                </div>
              </button>

              {index < editableStages && comments[index].text && (
                <div className={`comment-box comment-box-${index}`}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: getColor(index),
                      marginBottom: "5px",
                      fontSize: "15px"
                    }}
                  >
                    Stage {index + 1}
                  </div>
                  <div>{comments[index].text}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {activeIcon !== null && (
          <div className="input-popup">
            <textarea
              placeholder="Enter your comment"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
      </div>

      {/* Bottom Table Placeholder */}
      <div className="table-section">
        <h2>Stage Details (Coming Soon)</h2>
        {/* Your future content */}
      </div>
    </div>
  );
};

export default ClientDash;
