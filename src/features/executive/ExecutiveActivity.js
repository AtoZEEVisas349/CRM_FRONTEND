import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faPhone, faSync } from "@fortawesome/free-solid-svg-icons";
import {
  startCall,
  endCall,
  getActivityStatus,
} from "../../services/executiveService";
import { toast } from "react-toastify";
import "../../styles/executiveTracker.css";
import { useExecutiveActivity } from '../../context/ExecutiveActivityContext';
import useWorkTimer from "./useLoginTimer";
import { useApi } from "../../context/ApiContext";
import { useBreakTimer } from "../../context/breakTimerContext";

const ExecutiveActivity = () => {
  const { user } = useExecutiveActivity();
  const {handleStartBreak,handleStopBreak,handleStartCall,handleEndCall}=useExecutiveActivity()
  const { breakTimer, startBreak, stopBreak, isBreakActive, timerloading } = useBreakTimer();
  const timer = useWorkTimer();
  const { executiveInfo, executiveLoading, fetchExecutiveData, activityData, getExecutiveActivity } = useApi();
  
  // ✅ State to hold calculated totals
  const [dailyTotals, setDailyTotals] = useState({
    totalWorkTime: 0,
    totalBreakTime: 0
  });
  
  useEffect(() => {
    fetchExecutiveData(); // Call it only once on mount
  }, []);

  // ✅ Fetch daily activity data when executiveInfo is available
  useEffect(() => {
    if (executiveInfo?.id) {
      getExecutiveActivity(executiveInfo.id);
    }
  }, [executiveInfo?.id]);

  // ✅ Calculate totals when activityData changes
  useEffect(() => {
    if (activityData && Array.isArray(activityData)) {
      const totalWorkTime = activityData.reduce((sum, record) => sum + (record.workTime || 0), 0);
      const totalBreakTime = activityData.reduce((sum, record) => sum + (record.breakTime || 0), 0);
      
      setDailyTotals({
        totalWorkTime,
        totalBreakTime
      });
    } else if (activityData && typeof activityData === 'object') {
      // Handle case where API returns single object instead of array
      setDailyTotals({
        totalWorkTime: activityData.workTime || 0,
        totalBreakTime: activityData.breakTime || 0
      });
    }
  }, [activityData]);
  
  const [callText, setCallText] = useState('Start Call');
  
  const [status, setStatus] = useState({
    onBreak: false,
    isOnCall: false,
    workingTime: 0,
    breakTime: 0,
    callDuration: 0,
    currentLeadId: "",
  });

  const [loading, setLoading] = useState(false);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchActivityStatus = async () => {
    try {
      setLoading(true);
      const data = await getActivityStatus();
      setStatus((prev) => ({
        ...prev,
        onBreak: data.onBreak || false,
        isOnCall: data.onCall || false,
        workingTime: data.workingTime || 0,
        breakTime: data.breakTime || 0,
        callDuration: data.callDuration || 0,
        currentLeadId: data.currentLeadId || "",
      }));
    } catch (error) {
      console.error("Failed to fetch activity status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "Executive") {
      fetchActivityStatus();
      const backendInterval = setInterval(fetchActivityStatus, 30000);
      const uiInterval = setInterval(() => {
        setStatus((prev) => ({
          ...prev,
          workingTime: prev.workingTime + 1,
          breakTime: prev.onBreak ? prev.breakTime + 1 : prev.breakTime,
          callDuration: prev.isOnCall ? prev.callDuration + 1 : prev.callDuration,
        }));
      }, 1000);

      return () => {
        clearInterval(backendInterval);
        clearInterval(uiInterval);
      };
    }
  }, [user?.role]);

  useEffect(() => {
    if (!executiveInfo && !executiveLoading) {
      fetchExecutiveData(); // only when necessary
    }
  }, []);
  
  const [breakText, setBreakText] = useState("Take Break");
  const toggle= async () => {
    if (!isBreakActive) {
      await startBreak();
    } 
  };
  
  const toggleCallTracking = async () => {
    try {
      setLoading(true);

      if (!status.isOnCall) {
        if (!status.currentLeadId) {
          toast.warning("Please enter a Lead ID first");
          setLoading(false);
          return;
        }

        await startCall(status.currentLeadId);
        toast.info("Call tracking started");
      } else {
        await endCall(status.currentLeadId);
        toast.success("Call tracked successfully");
      }

      await fetchActivityStatus();
    } catch (error) {
      toast.error(`Failed to ${status.isOnCall ? "end" : "start"} call: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadIdChange = (e) => {
    setStatus((prev) => ({
      ...prev,
      currentLeadId: e.target.value,
    }));
  };

  const handleManualRefresh = () => {
    fetchActivityStatus();
    // ✅ Also refresh daily activity data
    if (executiveInfo?.id) {
      getExecutiveActivity(executiveInfo.id);
    }
    toast.info("Activity data refreshed");
  };
  
  const toggleCall = (e) => {
    if (callText === 'Start Call') {
       handleStartCall();
      setCallText('End Call');
      // ✅ Save call status
    } else {
      handleEndCall();
      setCallText('Start Call');
        // ✅ Save call status
    }
  }
  
  return (
    <div className="activity-tracker-container">
      <div className="tracker-widget">
        <div className="tracker-header">
          <h3>Activity Tracker</h3>
        </div>

        <div className="tracker-content">
          <div className="exec-info">
            <div className="exec-avatar">
              <span className="initial">
                {executiveInfo?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="exec-details">
              <div className="execu-name">
                <strong>{executiveInfo?.username || "Unknown User"}</strong>
              </div>
              <div className="exec-id">
                ID: <span>{executiveInfo?.id || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="status-badge">
            <strong>Status:</strong>{" "}
            {isBreakActive ? "Break" : "Working"}
          </div>

          <div className="time-display">
            <div className="time-block">
              <span className="time-label">Working Time:</span>
              <span className="time-value">{timer}</span>
            </div>

            <div className="daily-summary">
              <h4 className="summary-text">Today's Summary</h4>
              <ul>
                <li>Break Time for current login: {breakTimer}</li>
                <li>Working Time for current login: {timer}</li>
                <li>Total Work Time Today: {formatTime(dailyTotals.totalWorkTime)}</li>
                <li>Total Break Time Today: {formatTime(dailyTotals.totalBreakTime)}</li>
              </ul>
            </div>
            
            <div className="motivation-box">
              <blockquote>"Small consistent actions lead to big results."</blockquote>
              <small>- AtoZee Motivation</small>
            </div>
          </div>

          <div className="tracker-actions">
            <button
            className={`tracker-btn ${status.onBreak ? "active" : ""}`}
            onClick={toggle}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faCoffee} style={{color:"white"}}/>
          <p style={{color:"white"}}> {isBreakActive ? "End Break" : "Take Break"}</p>    
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveActivity;