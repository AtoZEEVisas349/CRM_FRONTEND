import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useExecutiveActivity } from "./ExecutiveActivityContext";

const BreakTimerContext = createContext();

export const BreakTimerProvider = ({ children }) => {
  const { handleStartBreak, handleStopBreak } = useExecutiveActivity(); 
  const [breakTimer, setBreakTimer] = useState("00:00:00");
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [timerloading, setTimerLoading] = useState(false);
  const [totalPausedSeconds, setTotalPausedSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const breakStart = localStorage.getItem('breakStartTime');
    const pausedSeconds = localStorage.getItem('pausedBreakSeconds');

    if (pausedSeconds) {
      setTotalPausedSeconds(parseInt(pausedSeconds));
      setBreakTimer(formatTime(parseInt(pausedSeconds)));
    }

    if (breakStart) {
      setIsBreakActive(true);
      const start = new Date(breakStart);
      startTimer(start, parseInt(pausedSeconds) || 0);
    }

    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = (startTime, previousSeconds = 0) => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const now = new Date();
      const diffSeconds = Math.floor((now - startTime) / 1000);
      setBreakTimer(formatTime(previousSeconds + diffSeconds));
    }, 1000);
  };

  const startBreak = async () => {
    try {
      setTimerLoading(true);
      await handleStartBreak(); 
      const start = new Date();
      localStorage.setItem('breakStartTime', start);
      setIsBreakActive(true);
      startTimer(start, totalPausedSeconds);
    } catch (error) {
      console.error("❌ Error starting break:", error.message);
    } finally {
      setTimerLoading(false);
    }
  };

  const stopBreak = async () => {
    try {
      setTimerLoading(true);
      await handleStopBreak(); 
      clearInterval(intervalRef.current);

      const currentTimer = breakTimerToSeconds(breakTimer);
      setTotalPausedSeconds(currentTimer);
      localStorage.setItem('pausedBreakSeconds', currentTimer);

      localStorage.removeItem('breakStartTime');
      setIsBreakActive(false);
    } catch (error) {
      console.error("❌ Error stopping break:", error.message);
    } finally {
      setTimerLoading(false);
    }
  };

  // 👉 Added this reset function to clear everything
  const resetBreakTimer = () => {
    clearInterval(intervalRef.current);
    setBreakTimer("00:00:00");
    setIsBreakActive(false);
    setTotalPausedSeconds(0);
    localStorage.removeItem('breakStartTime');
    localStorage.removeItem('pausedBreakSeconds');
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const breakTimerToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  return (
    <BreakTimerContext.Provider value={{ 
      breakTimer, 
      startBreak, 
      stopBreak, 
      isBreakActive, 
      timerloading, 
      resetBreakTimer   // ✅ Exporting reset here
    }}>
      {children}
    </BreakTimerContext.Provider>
  );
};

export const useBreakTimer = () => useContext(BreakTimerContext);
