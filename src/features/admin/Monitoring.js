import React, { useState, useEffect } from 'react';
import { useApi } from '../../context/ApiContext'; // ✅ Using Context API
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import SidebarToggle from "./SidebarToggle";


function Monitoring() {
    const [audioStatus, setAudioStatus] = useState({});
  const [videoStatus, setVideoStatus] = useState({});

  const toggleAudio = (id) => {
    setAudioStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleVideo = (id) => {
    setVideoStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };
    const [executives, setExecutives] = useState([]);
  const { fetchExecutivesAPI } = useApi();
   const fetchExecutives = async () => {
      try {
        const data = await fetchExecutivesAPI();
        setExecutives(data);
      } catch (error) {
        console.error("❌ Failed to load executives:", error);
      }
    };
  
    useEffect(() => {
      fetchExecutives();
    }, []);
  return (
    <>
    <SidebarToggle/>
   <div>

            <h1 style={{ textAlign: "center", marginTop: "20px" }}>Executives</h1>
            <div className="exec-grid">
                {executives?.map((e, i) => (
                <div className="exec-item" key={i}>
                    <p className='exec-name'
                    >{e?.username}</p>
                    <div className="exec-box-wrapper">
                    <div className="exec-box">
            <div className="exe-avatar">
                {e?.username?.charAt(0)?.toUpperCase()}
            </div>
            </div>
          <div className="media-toggle-attached">
            <div className="toggle-btn" onClick={() => toggleAudio(e.id)}>
              <FontAwesomeIcon
                icon={audioStatus[e.id] ? faMicrophone : faMicrophoneSlash}
                size="sm"
              />
            </div>
            <div className="toggle-btn" onClick={() => toggleVideo(e.id)}>
              <FontAwesomeIcon
                icon={videoStatus[e.id] ? faVideo : faVideoSlash}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    ))}  
  </div>
</div>
</>
  );
};

 
export default Monitoring;