import React, { useState, useEffect } from "react";
import { useProcessService } from "../../context/ProcessServiceContext";
import { useProcess } from "../../context/ProcessAuthContext"; // 👈 Import it

const ClientDash = () => {
  const { handleUpsertStages, handleGetStages } = useProcessService();

  const [stageCount, setStageCount] = useState(6); // Replaces editableStages
  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [activeIcon, setActiveIcon] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [stageData, setStageData] = useState({});
  const [hexagons, setHexagons] = useState([]);
  const { user } = useProcess(); // 👈 Hook gives you user type

  useEffect(() => {
    fetchAndSetStages();
  }, [stageCount]);

  useEffect(() => {
    const newHexagons = [];
    const topRowCount = Math.ceil(stageCount / 2);
    const bottomRowCount = Math.floor(stageCount / 2);
  
    for (let i = 0; i < topRowCount; i++) {
      const num = i * 2 + 1;
      const left = 140 + i * 260;
      newHexagons.push({ num, left, top: 120, row: "top" }); // decreased top Y
    }
  
    for (let i = 0; i < bottomRowCount; i++) {
      const num = (i + 1) * 2;
      const left = 280 + i * 260;
      newHexagons.push({ num, left, top: 360, row: "bottom" }); // decreased bottom Y
    }
  
    setHexagons(newHexagons);
  }, [stageCount]);
  

  const fetchAndSetStages = async () => {
    try {
      const latestStages = await handleGetStages();
      const newComments = [];

      for (let i = 0; i < stageCount; i++) {
        const text = latestStages[`stage${i + 1}_data`] || "";
        const date = latestStages[`stage${i + 1}_timestamp`]
          ? new Date(latestStages[`stage${i + 1}_timestamp`]).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
          : "";
        newComments.push({ text, date });
      }

      setComments(newComments);
      setExpanded(Array(stageCount).fill(false));
      setStageData(latestStages);
    } catch (err) {
      console.error("Error fetching customer stages:", err.message);
    }
  };

  const handleIconClick = (index) => {
    if (index < stageCount) {
      setActiveIcon(index);
      setInputValue(comments[index]?.text || "");
    }
  };

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString();
    const updatedStage = {
      [`stage${activeIcon + 1}_data`]: inputValue,
      [`stage${activeIcon + 1}_completed`]: true,
      [`stage${activeIcon + 1}_timestamp`]: currentDate,
    };

    const newStageData = { ...stageData, ...updatedStage };
    setStageData(newStageData);

    try {
      await handleUpsertStages(newStageData);
      await fetchAndSetStages();
      setActiveIcon(null);
    } catch (error) {
      console.error("API error:", error.message);
    }
  };

  const toggleExpand = (index) => {
    const updated = [...expanded];
    updated[index] = !updated[index];
    setExpanded(updated);
  };

  const getColor = (index) => {
    const colors = [
      "#f2a900", "#e74c3c", "#2ecc71",
      "#3498db", "#9b59b6", "#e67e22",
      "#1abc9c", "#ccd61d", "#ef1a93",
    ];
    return colors[index % colors.length] || "#000";
  };

  const addStage = () => setStageCount((prev) => prev + 1);
  const removeStage = () => {
    if (stageCount > 1) setStageCount((prev) => prev - 1);
  };

  const calculateRoadPath = (stageCount) => {
    const segments = Math.ceil(stageCount / 2);
    let path = "M0 260 ";
  
    for (let i = 0; i < segments; i++) {
      const x1 = 60 + i * 260;
      const x2 = 140 + i * 260;
      path += `C${x1} 260, ${x1} 130, ${x2} 130 `;
      if (i < segments - 1) {
        const x3 = 220 + i * 260;
        path += `S${x3} 260, ${x3 + 60} 260 `;
      }
    }
  
    return path;
  };
  

  return (
    <div className="page-wrapper">
      <div className="roadmap-container">
        <h1>Activity Roadmap</h1>
        {user?.type === "processperson" && (
        <div className="stage-controls" style={{ marginBottom: "1.5rem" }}>
          <button onClick={addStage} className="control-btn">Add Stage</button>
          <button onClick={removeStage} className="control-btn">Remove Stage</button>
          <span className="stage-count">Total Stages: {stageCount}</span>
        </div>
        )}
        <div className="timeline-container">
          <svg
            className="road-svg"
            fill="none"
            viewBox={`0 0 ${280 + Math.ceil(stageCount / 2) * 260} 450`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={calculateRoadPath(stageCount)}
              stroke="#4B4B4B"
              strokeLinecap="round"
              strokeWidth="70"
            />
            <path
              d={calculateRoadPath(stageCount)}
              stroke="white"
              strokeDasharray="10 15"
              strokeLinecap="round"
              strokeWidth="8"
            />

            {hexagons.map((hex) => (
              <React.Fragment key={`line-${hex.num}`}>
                <line
                  x1={hex.left}
                  y1="300"
                  x2={hex.left}
                  y2={hex.top - (hex.row === "top" ? 130 : 100)}
                  stroke="white"
                  strokeWidth="4"
                />
                <line
                  x1={hex.left - 10}
                  y1="300"
                  x2={hex.left + 10}
                  y2="300"
                  stroke="white"
                  strokeWidth="12"
                />
              </React.Fragment>
            ))}
          </svg>

          {hexagons.map((hex, index) => (
            <div
              key={hex.num}
              className="hexagon-container"
              style={{ left: `${hex.left - 35}px`, top: `${hex.top}px` }}
            >
              <div
                className="hexagon"
                style={{ backgroundColor: getColor(index),
                cursor: user?.type === "processperson" ? "pointer" : "not-allowed"
                 }}
                onClick={user?.type === "processperson" ? () => handleIconClick(index) : undefined}>
                <span>Stage {hex.num}</span>
              </div>

              {comments[index]?.text && (
                <div className="stage-description-card">
                  <div className="card-content">
                    <p
                      className="card-text"
                      style={{
                        maxHeight: expanded[index] ? "none" : "60px",
                        overflow: "hidden",
                      }}
                    >
                      {comments[index].text}
                    </p>
                    {comments[index].text.length > 100 && (
                      <button
                        className="expand-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(index);
                        }}
                      >
                        {expanded[index] ? "See Less" : "See More"}
                      </button>
                    )}
                  </div>
                  <h3>Stage {hex.num}</h3>
                </div>
              )}
            </div>
          ))}
        </div>

        {user?.type === "processperson" && activeIcon !== null && (
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
    </div>
  );
};

export default ClientDash;
