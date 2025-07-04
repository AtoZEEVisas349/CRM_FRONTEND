import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createCustomerStages,
  getCustomerStages,
  updateCustomerStages,
  profileSettings,
  getprofileSettings,
  updateProfileSettings,
  importConvertedClients,
  getAllCustomers,
  getCustomerStagesById,
  uploadCustomerDocuments,
  getCustomerDocuments,
  getProcessSettings,
  createProcessFollowUpApi,
  getProcessFollowupApi,
  createFinalStageApi,
  createCloseLeadApi,
  getAllProcessFollowupsApi,
  getProcessFollowupHistoryApi,
  createMeetings,
  startWorkApi,
  startBreakApi,
  stopBreakApi,
  stopWorkApi,
  getFinalStage,
  createCustomerStagesApi,
  getStageComments,
  moveToRejectedApi,
  getProcessHistoryApi,
  addStageCommentAndNotify,
  getProcessPersonMeetingsApi,
  getAllNotificationsByUser,
  getAllProcessPersonsApi,
  createProcessforConvertedApi,
  getAllProcessCustomerIdApi
} from "../services/processService";

// 1. Create Context
const ProcessServiceContext = createContext();

// 2. Provider Component
export const ProcessServiceProvider = ({ children }) => {
  // -----------------------
  // Stage Management State
  // -----------------------
  const [stages, setStages] = useState(null);
  const [stageLoading, setStageLoading] = useState(false);
  const [stageError, setStageError] = useState(null);

const [convertedClients, setConvertedClients] = useState([]);
const [convertedLoading, setConvertedLoading] = useState(false);
const [convertedError, setConvertedError] = useState(null);

  // -----------------------
  // Profile Settings State
  // -----------------------
  const [profiles, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // -----------------------
  // Effects
  // -----------------------
  useEffect(() => {
    getProfile();
  }, []);

  // -----------------------
  // Stage API Handlers
  // -----------------------
  const handleCreateStages = async (data) => {
    setStageLoading(true);
    setStageError(null);
    try {
      const response = await createCustomerStages(data);
      setStages(response.data);
      return response;
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };

  const handleUpdateStages = async (data) => {
    setStageLoading(true);
    setStageError(null);
    try {
      const response = await updateCustomerStages(data);
      setStages(response.data || data);
      return response;
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };

  const handleGetStages = async () => {
    setStageLoading(true);
    setStageError(null);
    try {
      const result = await getCustomerStages();
      setStages(result);
      return result;
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };

  const handleUpsertStages = async (data) => {
    setStageLoading(true);
    setStageError(null);
    try {
      try {
        const response = await createCustomerStages(data); // Try POST
        setStages(response.data);
        return response;
      } catch (err) {
        if (err.message.includes("already exist")) {
          const response = await updateCustomerStages(data); // Fallback to PUT
          setStages(response.data);
          return response;
        } else {
          throw err;
        }
      }
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };



  const [processProfile, setProcessProfile] = useState(null);
  // New handlers for process persons
  const getProcessProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProcessSettings();
      setProcessProfile(data);
    } catch (err) {
      setError(err.message || "Failed to fetch process settings");
    } finally {
      setLoading(false);
    }
  };
  // -----------------------
  // Profile Settings Handlers
  // -----------------------
   const processCreateFollowUp = async (payload) => {
    console.log(payload,"m")
    setLoading(true);
    setError(null);
    try {
      const data = await createProcessFollowUpApi(payload);
      
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const profile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await profileSettings(data);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getprofileSettings();
      setProfile(res);
    } catch (err) {
      setError(err?.error || "Failed to fetch profile settings");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSettings = async (data) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await updateProfileSettings(data);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const [customers, setCustomers] = useState([]);
   const[clients,setClients]=useState()
   
    const handleImportConvertedClients = async () => {
       setLoading(true);
    setError(null);
    try {
      const result = await importConvertedClients();
      setClients(result)
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await getAllProcessCustomerIdApi();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  const handleGetCustomerStagesById = async (customerId) => {
        try {
    const res = await getCustomerStagesById(customerId) // ✅ Adjust endpoint if needed
    console.log("Raw API response:", res); // This should now show an Axios response object
    return res; // ✅ MUST return this
  } catch (error) {
    console.error("Error in handleGetCustomerStagesById:", error);
    throw error;
  }
    

  };
  const uploadDocs = async (formData) => {
    try {
      const response= await uploadCustomerDocuments(formData);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };

  const getDocumentsApi = async (userType,id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerDocuments(userType,id);
       console.log(res.documents)
   return res.documents;

    } catch (err) {
      setError(err?.error || "Failed to fetch customer documents");
    } finally {
      setLoading(false);
    }
  };
    const getProcessFollowup = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProcessFollowupApi(id);
   return data;
    } catch (err) {
      setError(err.message || "Failed to fetch process settings");
    } finally {
      setLoading(false);
    }
  };
   
 const createFinalStage = async (payload) => {
    try {
      const response= await createFinalStageApi(payload);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const createRejected = async (payload) => {
    try {
      const response= await moveToRejectedApi(payload);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const createMeetingApi = async (managerData) => {
    try {
      const response= await createMeetings(managerData);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const createCloseLead = async (freshLeadId) => {
    try {
      const response= await createCloseLeadApi(freshLeadId);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const createStages = async (customerId, stageNumber, newComment) => {
    try {
      const response= await createCustomerStagesApi(customerId, stageNumber, newComment);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const getProcessAllFollowup = async () => {
  
    try {
      const data = await getAllProcessFollowupsApi();
   return data;
    } catch (err) {
      setError(err.message || "Failed to fetch process settings");
    } finally {
      setLoading(false);
    }
  };
    const getProcessFollowupHistory = async (id) => {
    try {
      const data = await getProcessFollowupHistoryApi(id);
   return data;
    } catch (err) {
      setError(err.message || "Failed to fetch process settings");
    } finally {
      setLoading(false);
    }
  };
    const getProcessHistory = async (id) => {
    try {
      const data = await getProcessHistoryApi(id);
   return data;
    } catch (err) {
      setError(err.message || "Failed to fetch process settings");
    } finally {
      setLoading(false);
    }
  };
    const getAllFinalStages = async () => {
    try {
      const data = await getFinalStage();
   return data;
    } catch (err) {
      setError(err.message || "Failed to fetch process settings");
    } finally {
      setLoading(false);
    }
  };
   const startWork = async (process_person_id) => {
    try {
      const response= await startWorkApi(process_person_id);
       if (response?.activity?.workStartTime) {
        localStorage.setItem(
          'workStartTime',
          new Date(response.activity.workStartTime).toISOString()
        );
      }
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const createStartBreak = async (id) => {
    try {
      const response= await startBreakApi(id);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const createStopBreak = async (id) => {
    try {
      const response= await stopBreakApi(id);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const stopWork = async (id) => {
    try {
      const response= await stopWorkApi(id);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
   const getComments = async (customerId, stageNumber) => {
    try {
      const response= await getStageComments(customerId, stageNumber);
      return response;
    } catch (error) {
      console.error(" error in context:", error);
      throw error;
    }
  };
    const createReminder = async ( customerId, stageNumber, newComment) => {
    try {
      const response= await addStageCommentAndNotify( customerId, stageNumber, newComment);
      return response;
    } catch (error) {
      console.error("Upload error in context:", error);
      throw error;
    }
  };
  const getProcessPersonMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProcessPersonMeetingsApi();
      return response.meetings; // returns just the array of meetings
    } catch (error) {
      console.error("Error fetching process person meetings:", error);
      setError(error.message || "Failed to fetch process meetings");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const fetchNotifications = async (userRole, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllNotificationsByUser(userRole, page);
    
      return response; // returns just the array of notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(error.message || "Failed to fetch notifications");
      throw error;
    } finally {
      setLoading(false);
    }
  };
    const getAllProcessPersons = async () => {
      setLoading(true);
      try {
        const data = await getAllProcessPersonsApi();
       return data;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
   
  const createProcesstoConverted = async (payload) => {
    try {
      const data = await createProcessforConvertedApi(payload);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getProcessCustomerById = async () => {
      setLoading(true);
      try {
        const data = await getAllCustomers();
       return data;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  // -----------------------
  // Provider Return
  // -----------------------
  return (
    <ProcessServiceContext.Provider
      value={{
        // Stages
        stages,
        stageLoading,
        stageError,
        handleCreateStages,
        handleUpdateStages,
        handleGetStages,
        handleUpsertStages,

        // Profiles
        profile,
        getProfile,
        handleProfileSettings,
        profiles,
        setProfile,
processProfile,
        convertedClients,
    convertedLoading,
    convertedError,
    fetchCustomers,
    customers,
    getProcessPersonMeetings,
    setCustomers,
    handleImportConvertedClients,
    handleGetCustomerStagesById,
    uploadDocs,
    getDocumentsApi,
    getProcessProfile,
    processCreateFollowUp,
    getProcessFollowup,
    createFinalStage,
    createCloseLead,
    getProcessAllFollowup,
    getProcessFollowupHistory,
    createMeetingApi,
    startWork,
    createStartBreak,
    createStopBreak,
    stopWork,
    getAllFinalStages,
    createStages,
    getComments,
    createRejected,
    getProcessHistory,
    createReminder,
    fetchNotifications,
    getAllProcessPersons,
    createProcesstoConverted,
    getProcessCustomerById
      }}
    >
      {children}
    </ProcessServiceContext.Provider>
  );
};

// 3. Custom Hook
export const useProcessService = () => useContext(ProcessServiceContext);