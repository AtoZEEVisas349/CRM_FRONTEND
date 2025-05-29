
import React, { useState, useEffect } from 'react';
import { useProcessService } from "../../context/ProcessServiceContext";
import { useProcess } from "../../context/ProcessAuthContext";
import { useParams } from "react-router-dom";
import img1 from '../../assets/user.png';
import img2 from '../../assets/user1.png'
const ClientDash = ({ initialStages = 6 }) => {

    const { id } = useParams();
  const { handleUpsertStages, handleGetStages,handleGetCustomerStagesById } = useProcessService();
  const { user } = useProcess();

    const [comments, setComments] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [activeIcon, setActiveIcon] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [stageData, setStageData] = useState({});
    const[processData,setprocessData]=useState({})
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
      console.log(comments)
      setExpanded(Array(stageCount).fill(false));
      setStageData(latestStages);
    } catch (err) {
      console.error("Error fetching customer stages:", err.message);
    }
  }
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
  if (!user?.type ) return; // Wait until user is loaded

  if (user?.type  === "customer") {
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

  const saveDescription = async(stageNum) => {
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

  const calculateRoadPath = () => {
    const segments = Math.ceil(stageCount / 2);
    let path = "M0 300 ";

    for (let i = 0; i < segments; i++) {
      const x1 = 60 + i * 260;
      const x2 = 140 + i * 260;
      path += `C${x1} 300, ${x1} 150, ${x2} 150 `;

      if (i < segments - 1) {
        const x3 = 220 + i * 260;
        path += `S${x3} 300, ${x3 + 60} 300 `;
      }
    }

    return path;
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
    await fetchStages(); // refresh to get clean state
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
 
  return (
    <div className="road-timeline-container" >
      <h2 className="descriptions-title">Activity Roadmap</h2>
      <div className="stage-controls">
        <button onClick={addStage} className="control-btn">Add Stage</button>
        <button onClick={removeStage} className="control-btn">Remove Stage</button>
        <span className="stage-count">Total Stages: {stageCount}</span>
      </div>

      <div className="timeline-container" >
        <svg
  className="road-svg"
  fill="none"
  viewBox={`0 0 ${280 + Math.ceil(stageCount / 2) * 260} 500`}
  xmlns="http://www.w3.org/2000/svg"
>
  {/* Road path */}
  <path
    d={calculateRoadPath()}
    stroke="#4B4B4B"
    strokeLinecap="round"
    strokeWidth="70"
  />
  <path
    d={calculateRoadPath()}
    stroke="white"
    strokeDasharray="10 15"
    strokeLinecap="round"
    strokeWidth="8"
  />

  {/* Start user image */}
  <image
    href={img2}
    x={-50}     // tweak this to move left/right
    y={120}    // tweak this to move up/down
    width={90}  // bigger size
    height={160}
  />

  {/* End user1 image */}
  <image
    href={img1}
    x={280 + Math.ceil(stageCount / 2) * 260 - 290}
 y={120} 
   width={90}  // bigger size
    height={160}
  />

          {hexagons.filter(h => h.row === 'top').map((hex) => (
            <React.Fragment key={`top-connector-${hex.num}`}>
              <line
                x1={hex.left}
                y1="150"
                x2={hex.left}
                y2={hex.top - 130}
                stroke="white"
                strokeWidth="4"
              />
              <line
                x1={hex.left - 10}
                y1="150"
                x2={hex.left + 10}
                y2="150"
                stroke="white"
                strokeWidth="12"
              />
            </React.Fragment>
          ))}

          {hexagons.filter(h => h.row === 'bottom').map((hex) => (
            <React.Fragment key={`bottom-connector-${hex.num}`}>
              <line
                x1={hex.left}
                y1="300"
                x2={hex.left}
                y2={hex.top - 100}
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
            data-row={hex.row}
            style={{
              left: `${hex.left - 35}px`,
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
        ))}
      </div>
    </div>
  );
};

export default ClientDash;
