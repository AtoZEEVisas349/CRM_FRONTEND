
import React, { useState, useEffect } from 'react';
import { useProcessService } from "../../context/ProcessServiceContext";
import { useProcess } from "../../context/ProcessAuthContext";
import { useParams } from "react-router-dom";
import img1 from '../../assets/user.png';
import img2 from '../../assets/user1.png';

const ClientDash = ({ initialStages = 6 }) => {
  const { id } = useParams();
  const { handleUpsertStages, handleGetStages, handleGetCustomerStagesById } = useProcessService();
  const { user } = useProcess();

  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [activeIcon, setActiveIcon] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [stageData, setStageData] = useState({});
  const [processData, setProcessData] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [activeDescription, setActiveDescription] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [stageCount, setStageCount] = useState(initialStages);
  const [hexagons, setHexagons] = useState([]);

  const fetchStages = async () => {
    try {
      const latestStages = await handleGetCustomerStagesById(id);
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
      console.log(newComments);
      setExpanded(Array(stageCount).fill(false));
      setStageData(latestStages);
    } catch (err) {
      console.error("Error fetching customer stages:", err.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStages();
    }
  }, [id, stageCount]);

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

  useEffect(() => {
    if (!user?.type) return;

    if (user?.type === "customer") {
      fetchAndSetStages();
    }
  }, [stageCount, user]);

  const colors = [
    '#264653', '#e76f51', '#2a9d8f', '#a8dadc',
    '#e9c46a', '#457b9d', '#f4a261', '#ff6b6b',
    '#3a86ff', '#8338ec', '#ff006e', '#fb5607'
  ];

  useEffect(() => {
    const newHexagons = [];
    const topRowCount = Math.ceil(stageCount / 2);
    const bottomRowCount = Math.floor(stageCount / 2);

    for (let i = 0; i < topRowCount; i++) {
      const stageNum = i * 2 + 1;
      const left = 140 + i * 260;
      newHexagons.push({
        num: stageNum,
        left,
        top: 160,
        bg: colors[i % colors.length],
        border: "#9c2f6f",
        row: 'top'
      });
    }

    for (let i = 0; i < bottomRowCount; i++) {
      const stageNum = (i + 1) * 2;
      const left = 280 + i * 260;
      newHexagons.push({
        num: stageNum,
        left,
        top: 500,
        bg: colors[(i + topRowCount) % colors.length],
        border: "transparent",
        row: 'bottom'
      });
    }

    setHexagons(newHexagons);
  }, [stageCount]);

  const toggleCardExpand = (stageNum) => {
    setExpandedCards(prev => ({
      ...prev,
      [stageNum]: !prev[stageNum]
    }));
  };

  const showDescriptionModal = (stageNum) => {
    setActiveDescription(stageNum);
  };

  const saveDescription = async (stageNum) => {
    const input = document.getElementById(`desc-input-${stageNum}`);
    const text = input.value.trim();

    if (text) {
      setDescriptions(prev => ({ ...prev, [stageNum]: text }));
      setActiveDescription(null);
    }
    const currentDate = new Date().toISOString();
    const updatedStage = {
      [`stage${activeIcon + 1}_data`]: inputValue,
      [`stage${activeIcon + 1}_completed`]: true,
      [`stage${activeIcon + 1}_timestamp`]: currentDate,
    };

    const newStageData = { ...stageData, ...updatedStage };
    setStageData(newStageData);

    try {
      await handleUpsertStages({ ...newStageData, customerId: id });
      await fetchAndSetStages();
      setActiveIcon(null);
    } catch (error) {
      console.error("API error:", error.message);
    }
  };

  const addStage = () => {
    setStageCount(prev => prev + 1);
  };

  const removeStage = () => {
    if (stageCount > 1) {
      setStageCount(prev => prev - 1);
      setDescriptions(prev => {
        const newDescs = { ...prev };
        delete newDescs[stageCount];
        return newDescs;
      });
    }
  };

  const calculateRealisticRoadPath = () => {
    const segments = Math.ceil(stageCount / 2);
    let mainPath = "M0 330 ";
    let shadowPath = "M0 335 ";
    
    for (let i = 0; i < segments; i++) {
      const x1 = 60 + i * 260;
      const x2 = 140 + i * 260;
      
      // Main road curve
      mainPath += `C${x1} 330, ${x1} 180, ${x2} 180 `;
      // Shadow path (slightly offset)
      shadowPath += `C${x1} 335, ${x1} 185, ${x2} 185 `;

      if (i < segments - 1) {
        const x3 = 220 + i * 260;
        mainPath += `S${x3} 330, ${x3 + 60} 330 `;
        shadowPath += `S${x3} 335, ${x3 + 60} 335 `;
      }
    }
    

    return { mainPath, shadowPath };
  };

  const generateRoadMarkings = () => {
    const segments = Math.ceil(stageCount / 2);
    const markings = [];
    
    for (let i = 0; i < segments; i++) {
      const baseX = 60 + i * 260;
      
      // Create dashed line markings along the curve
      for (let j = 0; j < 10; j++) {
        const progress = j / 9;
        const x = baseX + (80 * progress);
        const y = 330 - (150 * Math.sin(progress * Math.PI));
        
        markings.push(
          <rect
            key={`marking-${i}-${j}`}
            x={x - 8}
            y={y - 2}
            width="16"
            height="4"
            fill="transparent"
            opacity="0.9"
            rx="2"
          />
        );
      }
    }
    
    return markings;
  };

  const handleIconClick = (index) => {
    if (index < stageCount) {
      setActiveIcon(index);
      const stageKey = `stage${index + 1}_data`;
      setInputValue(stageData[stageKey] || "");
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
      await handleUpsertStages({ ...newStageData, customerId: id });
      await fetchStages();
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

  const { mainPath, shadowPath } = calculateRealisticRoadPath();

  return (
    <div className="road-timeline-container">

      <h2 className="descriptions-title">Activity Roadmap</h2>
      <div className="stage-controls">
        <button onClick={addStage} className="control-btn">Add Stage</button>
        <button onClick={removeStage} className="control-btn">Remove Stage</button>
        <span className="stage-count">Total Stages: {stageCount}</span>
      </div>

      <div className="timeline-container">
        <svg
          className="road-svg"
          fill="none"
          viewBox={`0 0 ${280 + Math.ceil(stageCount / 2) * 260} 600`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a4a4a" />
              <stop offset="50%" stopColor="#2c2c2c" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            <linearGradient id="roadShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
            </linearGradient>
            <filter id="roadBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
            </filter>
          </defs>

          {/* Road Shadow */}
          <path
            d={shadowPath}
            className="road-shadow"
            filter="url(#roadBlur)"
          />

          {/* Road Border */}
          <path
            d={mainPath}
            className="road-border"
          />

          {/* Main Road Surface */}
          <path
            d={mainPath}
            className="road-surface"
          />

          {/* Road Center Line */}
          <path
            d={mainPath}
            className="road-centerline"
          />

          {/* Road Markings */}
          {generateRoadMarkings()}

          {/* Start user image */}
          <image
            href={img2}
            x={-160}
            y={280}
            width={150}
            height={200}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              animation: 'float 3s ease-in-out infinite'
            }}
          />

          {/* End user1 image */}
          <image
            href={img1}
            x={280 + Math.ceil(stageCount / 2) * 260 - 230}
            y={290}
            width={140}
            height={200}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              animation: 'float 3s ease-in-out infinite 1.5s'
            }}
          />

          {/* Connection lines for hexagons */}
          {hexagons.filter(h => h.row === 'top').map((hex) => (
            <React.Fragment key={`top-connector-${hex.num}`}>
              <line
                x1={hex.left}
                y1="180"
                x2={hex.left}
                y2={hex.top - 130}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                className="connector-line"
                strokeDasharray="5,5"
              />
              <circle
                cx={hex.left}
                cy="180"
                r="8"
                fill="white"
                stroke="#3b82f6"
                strokeWidth="3"
              />
            </React.Fragment>
          ))}

          {hexagons.filter(h => h.row === 'bottom').map((hex) => (
            <React.Fragment key={`bottom-connector-${hex.num}`}>
              <line
                x1={hex.left}
                y1="330"
                x2={hex.left}
                y2={hex.top - 100}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                className="connector-line"
                strokeDasharray="5,5"
              />
              <circle
                cx={hex.left}
                cy="330"
                r="8"
                fill="white"
                stroke="#3b82f6"
                strokeWidth="3"
              />
            </React.Fragment>
          ))}
        </svg>

        {hexagons.map((hex, index) => (
          <div
            key={hex.num}
            className="hexagon-container"
            data-row={hex.row}
            style={{
              left: `${hex.left + 55}px`,
              top: `${hex.top}px`,
            }}
          >
            <div
              className={`hexagon hexagon-${hex.num}`}
              style={{
                backgroundColor: hex.bg,
                borderColor: hex.border,
                cursor: user?.type === "processperson" ? "pointer" : "not-allowed"
              }}
              onClick={(e) => {
                e.stopPropagation();
                showDescriptionModal(hex.num);
                if (user?.type === "processperson") {
                  handleIconClick(hex.num - 1);
                }
              }}
            >
              <span>Stage {hex.num}</span>
            </div>

            {comments[hex.num - 1]?.text && (
              <div className="stage-description-card">
                <div className="card-content">
                  <p
                    className="card-text"
                    style={{
                      maxHeight: expandedCards[hex.num - 1] ? 'none' : '60px',
                      overflow: 'hidden',
                    }}
                  >
                    {comments[hex.num - 1].text}
                  </p>
                  {comments[hex.num - 1].text.length > 100 && (
                    <button
                      className="expand-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardExpand(hex.num - 1);
                      }}
                    >
                      {expandedCards[hex.num - 1] ? 'See Less' : 'See More'}
                    </button>
                  )}
                </div>
                <h3>{comments[hex.num - 1].date}</h3>
              </div>
            )}
          </div>
        ))}

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