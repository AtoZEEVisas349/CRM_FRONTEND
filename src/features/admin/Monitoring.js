import React, { useState, useEffect } from "react";
import { useApi } from "../../context/ApiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import SidebarToggle from "./SidebarToggle";

function Monitoring() {
  const [audioStatus, setAudioStatus] = useState({});
  const [videoStatus, setVideoStatus] = useState({});
  const [executives, setExecutives] = useState([]);
  const [selectedExec, setSelectedExec] = useState(null);

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

  const toggleAudio = (id) => {
    setAudioStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleVideo = (id) => {
    setVideoStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedExecutive = executives.find((e) => e.username === selectedExec);

  return (
    <>
      <SidebarToggle />
      <div>
        <h1 style={{ textAlign: "center", marginTop: "20px" }}>
          Choose Executives
        </h1>

        {/* Dropdown */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <select
            onChange={(e) =>
              setSelectedExec(e.target.value === "all" ? null : e.target.value)
            }
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              minWidth: "200px",
            }}
          >
            <option value="all">All Executives</option>
            {executives.map((e, i) => (
              <option key={i} value={e.username}>
                {e.username}
              </option>
            ))}
          </select>
        </div>

        <div className="exec-grid">
          {selectedExec && selectedExecutive ? (
            // <>
            //   {[1, 2].map((boxNum) => (
            //     <div
            //       key={boxNum}
            //       className="exec-item large-box" // 👈 apply extra class
            //     >

            //       <div className="exec-box-wrapper large-wrapper">
            //         {" "}
            //         {/* 👈 extra class */}
            //         <div className="exec-box large-box-body">
            //           {" "}
            //           {/* 👈 extra class */}
            //           <div className="exe-avatar">
            //             {selectedExecutive.username.charAt(0).toUpperCase()}
            //           </div>
            //         </div>
            //         <div className="media-toggle-attached">

            //           <div>Press to Start SC</div>
            //         </div>
            //       </div>
            //     </div>
            //   ))}
            // </>
            <>
              {/* Box 1: Screen Cast */}
              <div className="exec-item large-box">
                <div className="exec-box-wrapper large-wrapper">
                  <div className="exec-box large-box-body">
                    <div className="exe-avatar">
                      {selectedExecutive.username.charAt(0).toUpperCase()}
                    </div>                    
                  </div>
                  <div className="media-toggle-attached">
                    <div
                      className="clickable-action"
                      onClick={() => alert("Starting Screen Cast...")}
                    >
                      Press to start Screen Cast
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Video */}
              <div className="exec-item large-box">
                <div className="exec-box-wrapper large-wrapper">
                  <div className="exec-box large-box-body">
                    <div className="exe-avatar">
                      {selectedExecutive.username.charAt(0).toUpperCase()}
                    </div>                    
                  </div>
                  <div className="media-toggle-attached">
                    <div
                      className="clickable-action"
                      onClick={() => alert("Starting Screen Cast...")}
                    >
                      Press to start Vedio
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // 👇 normal map loop stays unchanged
            executives.map((e, i) => (
              <div className="exec-item" key={i}>
                <p className="exec-name">{e.username}</p>
                <div className="exec-box-wrapper">
                  <div className="exec-box">
                    <div className="exe-avatar">
                      {e.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="media-toggle-attached">
                    <div
                      className="toggle-btn"
                      onClick={() => toggleAudio(e.id)}
                    >
                      <FontAwesomeIcon
                        icon={
                          audioStatus[e.id] ? faMicrophone : faMicrophoneSlash
                        }
                        size="sm"
                      />
                    </div>
                    <div
                      className="toggle-btn"
                      onClick={() => toggleVideo(e.id)}
                    >
                      <FontAwesomeIcon
                        icon={videoStatus[e.id] ? faVideo : faVideoSlash}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Audio Bar only when one executive is selected */}
        {selectedExec && (
          <div className="audio-test-bar">🔊 Audio Test Panel</div>
        )}
      </div>
    </>
  );
}

export default Monitoring;