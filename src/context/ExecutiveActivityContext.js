import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  recordStartWork,
  recordStopWork,
  recordStartBreak,
  recordStopBreak,
  startCall,
  endCall,
  getActivityStatus
} from '../services/executiveService';

// Create Context
const ExecutiveActivityContext = createContext();

// Hook for easier usage
export const useExecutiveActivity = () => useContext(ExecutiveActivityContext);

// Provider
export const ExecutiveActivityProvider = ({ children }) => {
  const [status, setStatus] = useState({
    workActive: false,
    breakActive: false,
    callActive: false,
  });

  const [loading, setLoading] = useState(false);

  // Fetch initial status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const data = await getActivityStatus();
        setStatus({
          workActive: data.workActive,
          breakActive: data.breakActive,
          callActive: data.callActive,
        });
      } catch (error) {
        console.error('Error fetching activity status:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  // Action handlers
  const handleStartWork = async () => {
    try {
      setLoading(true);
      await recordStartWork();
      setStatus(prev => ({ ...prev, workActive: true }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopWork = async () => {
    try {
      setLoading(true);
      await recordStopWork();
      setStatus({ workActive: false, breakActive: false, callActive: false });
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartBreak = async () => {
    try {
      setLoading(true);
      await recordStartBreak();
      setStatus(prev => ({ ...prev, breakActive: true }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopBreak = async () => {
    try {
      setLoading(true);
      await recordStopBreak();
      setStatus(prev => ({ ...prev, breakActive: false }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = async (leadId) => {
    try {
      setLoading(true);
      await startCall(leadId);
      setStatus(prev => ({ ...prev, callActive: true }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async (leadId) => {
    try {
      setLoading(true);
      await endCall(leadId);
      setStatus(prev => ({ ...prev, callActive: false }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExecutiveActivityContext.Provider
      value={{
        status,
        loading,
        handleStartWork,
        handleStopWork,
        handleStartBreak,
        handleStopBreak,
        handleStartCall,
        handleEndCall,
      }}
    >
      {children}
    </ExecutiveActivityContext.Provider>
  );
};
