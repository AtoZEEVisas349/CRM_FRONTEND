import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  recordStartWork,
  recordStopWork,
  recordStartBreak,
  recordStopBreak,
  startCall,
  endCall,
  getActivityStatus,
  leadtrackVisit,
  sendEmail
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
  useEffect(() => {
      handleStartWork(); 
     const handleBeforeUnload = async () => {
      await handleStopWork();
      };
    
    }, []);

  // Action handlers
  const[startTimeData,setStartTimeData]=useState();
  const handleStartWork = async () => {
    try {
      setLoading(true);
      const response = await recordStartWork();
      console.log(response.activity,"r")
      setStartTimeData(response.activity,"r")
      
      if (response?.activity?.workStartTime) {
        localStorage.setItem(
          'workStartTime',
          new Date(response?.activity?.workStartTime).toISOString()
        );
      }
  
      setStatus(prev => ({ ...prev, workActive: true }));
    } catch (error) {
      console.error("❌ Error recording start work:", error.message);
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
      const response=await recordStartBreak();
      console.log(response?.activity?.breakStartTime)
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
      const data = await recordStopBreak();
      console.log(data?.breakDuration)
      setStatus(prev => ({ ...prev, breakActive: false }));
      return data.breakDuration;
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
  const leadtrack = async (executiveId) => {
    try {
      setLoading(true);
      if (executiveId) {
        await leadtrackVisit(executiveId);
      } else {
        console.error('ExecutiveId is missing.');
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async ({
    templateId,
    executiveName,
    executiveEmail,
    clientEmail,
    emailBody,
    emailSubject,
  }) => {
    return await sendEmail({
      templateId,
      executiveName,
      executiveEmail,
      clientEmail,
      emailBody,
      emailSubject,
    });
  };

  return (
    <ExecutiveActivityContext.Provider
      value={{
        status,
        loading,
        setStatus,  
        startTimeData,
        setStartTimeData,
        handleStartWork,
        handleStopWork,
        handleStartBreak,
        handleStopBreak,
        handleStartCall,
        handleEndCall,
        handleSendEmail,
        sendEmail,
        leadtrack
      }}
    >
      {children}
    </ExecutiveActivityContext.Provider>
  );
};
