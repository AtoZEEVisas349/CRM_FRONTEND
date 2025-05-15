import React, { useState, useEffect } from "react";
import roadMapImage from "../../assets/roadMapImage.jpeg";
import { useProcessService } from "../../context/ProcessServiceContext";

const iconPositions = [
  { top: "25%", left: "22.5%" },
  { top: "78%", left: "29.7%" },
  { top: "20%", left: "36.7%" },
  { top: "72%", left: "44.1%" },
  { top: "14%", left: "50.5%" },
  { top: "73%", left: "57.5%" },
  { top: "19%", left: "64.5%" },
  { top: "78%", left: "71.3%" },
  { top: "24%", left: "79%" },
];

const ClientDash = () => {
  const editableStages = 6;
  const { handleUpsertStages, handleGetStages } = useProcessService();

  const [comments, setComments] = useState(Array(iconPositions.length).fill({ text: "", date: "" }));
  const [expanded, setExpanded] = useState(Array(iconPositions.length).fill(false));
  const [activeIcon, setActiveIcon] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const [stageData, setStageData] = useState({
    stage1_data: "",
    stage1_completed: false,
    stage1_timestamp: null,
    stage2_data: "",
    stage2_completed: false,
    stage2_timestamp: null,
    stage3_data: "",
    stage3_completed: false,
    stage3_timestamp: null,
    stage4_data: "",
    stage4_completed: false,
    stage4_timestamp: null,
    stage5_data: "",
    stage5_completed: false,
    stage5_timestamp: null,
    stage6_data: "",
    stage6_completed: false,
    stage6_timestamp: null,
  });

  useEffect(() => {
    fetchAndSetStages();
  }, []);

  const fetchAndSetStages = async () => {
    try {
      const latestStages = await handleGetStages();
      const newComments = [...comments];

      for (let i = 0; i < 6; i++) {
        const text = latestStages[`stage${i + 1}_data`] || "";
        const date = latestStages[`stage${i + 1}_timestamp`]
          ? new Date(latestStages[`stage${i + 1}_timestamp`]).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
          : "";
        newComments[i] = { text, date };
      }

      setComments(newComments);
      setStageData(latestStages);
    } catch (err) {
      console.error("Error fetching customer stages:", err.message);
    }
  };

  const handleIconClick = (index) => {
    if (index < editableStages) {
      setActiveIcon(index);
      setInputValue(comments[index].text);
    }
  };

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString();

    const updatedStage = {
      [`stage${activeIcon + 1}_data`]: inputValue,
      [`stage${activeIcon + 1}_completed`]: true,
      [`stage${activeIcon + 1}_timestamp`]: currentDate,
    };

    const newStageData = {
      ...stageData,
      ...updatedStage,
    };

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
    updated[index] = !expanded[index];
    setExpanded(updated);
  };

  const getColor = (index) => {
    const colors = [
      "#f2a900", "#e74c3c", "#2ecc71",
      "#3498db", "#9b59b6", "#e67e22",
      "#1abc9c", "#ccd61d", "#ef1a93",
    ];
    return colors[index] || "#000";
  };

  return (
    <div className="page-wrapper">
      <div className="roadmap-container">
        <h1>Activity Roadmap</h1>
        <div className="process-image-wrapper">
          <img src={roadMapImage} alt="Roadmap" className="roadmap-image" />
          {iconPositions.map((pos, index) => (
            <div key={index} className="icon-container" style={{ top: pos.top, left: pos.left }}>
              <button
                className={`hex-button hex-icon-${index}`}
                onClick={() => handleIconClick(index)}
                disabled={index >= editableStages}
                style={{ cursor: index >= editableStages ? "default" : "pointer" }}
              >
                <div className="hex-text">
                  <small>Stage</small>
                  <small>{index + 1}</small>
                </div>
              </button>

              {index < editableStages && comments[index].text && (
                <div
                  className={`comment-box ${expanded[index] ? "expanded" : "collapsed"}`}
                  style={{
                    borderColor: getColor(index),
                    top: parseFloat(pos.top) < 50 ? "-90px" : "60px",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: getColor(index), fontSize: "15px", marginBottom: "5px" }}>
                    Stage {index + 1}
                  </div>
                  <div>
                    {expanded[index]
                      ? comments[index].text
                      : (
                        <>
                          {comments[index].text.slice(0, 100)}...
                          <span
                            onClick={() => toggleExpand(index)}
                            style={{ color: "#007bff", cursor: "pointer", fontSize: "12px", marginLeft: "6px" }}
                          >
                            See more
                          </span>
                        </>
                      )}
                  </div>
                  {expanded[index] && comments[index].text.length > 100 && (
                    <div
                      onClick={() => toggleExpand(index)}
                      style={{ color: "#007bff", cursor: "pointer", fontSize: "12px", marginTop: "6px" }}
                    >
                      See less
                    </div>
                  )}
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

      <div className="table-section">
        <h2>Stage Details (Coming Soon)</h2>
      </div>
    </div>
  );
};

export default ClientDash;
