import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faPhone, faSync } from "@fortawesome/free-solid-svg-icons";
import {
  recordStartBreak,
  recordStopBreak,
  startCall,
  endCall,
  getActivityStatus,
} from "../../services/executiveService";
import { toast } from "react-toastify";
import "../../styles/executiveTracker.css";
import { useExecutiveActivity } from '../../context/ExecutiveActivityContext';

const ExecutiveActivity = () => {
  const { user } = useExecutiveActivity();

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
      console.log("Activity data received:", data);
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

  const toggleBreak = async () => {
    try {
      setLoading(true);

      if (!status.onBreak) {
        await recordStartBreak();
        toast.info("Break started!");
      } else {
        await recordStopBreak();
        toast.info("Break ended!");
      }

      await fetchActivityStatus();
    } catch (error) {
      toast.error(`Failed to ${status.onBreak ? "end" : "start"} break: ${error.message}`);
    } finally {
      setLoading(false);
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
    toast.info("Activity data refreshed");
  };

  return (
    <div className="activity-tracker-container">
      <div className="tracker-widget">
        <div className="tracker-header">
          <h3>Activity Tracker</h3>
          <button
            className="refresh-btn"
            onClick={handleManualRefresh}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSync} spin={loading} />
          </button>
        </div>

        <div className="tracker-content">
          <div className="exec-info">
            <div className="exec-avatar">
              <span className="initial">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="exec-details">
              <div className="exec-name">
                <strong>{user?.username || "Unknown User"}</strong>
              </div>
              <div className="exec-id">
                ID: <span>{user?.id || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="status-badge">
            <strong>Status:</strong>{" "}
            {status.onBreak ? "On Break" : status.isOnCall ? "On Call" : "Working"}
          </div>

          <div className="time-display">
            <div className="time-block">
              <span className="time-label">Working Time:</span>
              <span className="time-value">{formatTime(status.workingTime)}</span>
            </div>

            {status.onBreak && (
              <div className="time-block break-time">
                <span className="time-label">Break Time:</span>
                <span className="time-value">{formatTime(status.breakTime)}</span>
              </div>
            )}

            {status.isOnCall && (
              <div className="time-block call-time">
                <span className="time-label">Call Duration:</span>
                <span className="time-value">{formatTime(status.callDuration)}</span>
              </div>
            )}

            <div className="daily-summary">
              <h4>Today's Summary</h4>
              <ul>
                <li>Total Break Time: {formatTime(status.breakTime)}</li>
                <li>Total Call Time: {formatTime(status.callDuration)}</li>
                <li>Working Time So Far: {formatTime(status.workingTime)}</li>
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
              onClick={toggleBreak}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faCoffee} />
              {status.onBreak ? "End Break" : "Take Break"}
            </button>

            <button
              className={`tracker-btn ${status.isOnCall ? "active" : ""}`}
              onClick={toggleCallTracking}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPhone} />
              {status.isOnCall ? "End Call" : "Start Call"}
            </button>
          </div>

          <div className="lead-input">
            <input
              type="text"
              placeholder="Lead ID"
              value={status.currentLeadId}
              onChange={handleLeadIdChange}
              disabled={status.isOnCall}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveActivity;
