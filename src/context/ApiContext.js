import React, { createContext, useContext, useState, useEffect } from "react";
import * as apiService from "../services/apiService";
import * as upload from "../services/fileUpload";
import { useCallback } from "react";
import * as executiveService from "../services/executiveService";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // ✅ Existing state
  const [executiveInfo, setExecutiveInfo] = useState(null);
  const [executiveLoading, setExecutiveLoading] = useState(false);

  // ✅ User state
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [userLoading, setUserLoading] = useState(false);

  // ✅ Online Executives state
  const [onlineExecutives, setOnlineExecutives] = useState([]);
  const [onlineLoading, setOnlineLoading] = useState(false);

  // ✅ New: Follow-up Histories state
  const [followUpHistories, setFollowUpHistories] = useState([]);
  const [followUpHistoriesLoading, setFollowUpHistoriesLoading] =
    useState(false);

  // ✅ Fetch executive data
  const fetchExecutiveData = async () => {
    setExecutiveLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const executiveId = currentUser?.id;

      if (!executiveId) {
        console.error("No executiveId found in localStorage!");
        setExecutiveLoading(false);
        return;
      }

      const response = await apiService.fetchExecutiveInfo(executiveId);

      if (response?.data?.executive) {
        setExecutiveInfo(response.data.executive);
      } else {
        console.error("Executive data missing:", response.data);
      }
    } catch (error) {
      console.error("Error fetching executive data:", error);
    } finally {
      setExecutiveLoading(false);
    }
  };

  // ✅ Fetch user data
  const fetchUserData = async () => {
    setUserLoading(true);
    try {
      const response = await apiService.fetchAdminProfile();
      const { name, email, role } = response.data;
      setUser({ name, email, role });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setUserLoading(false);
    }
  };

  // ✅ Fetch online executives
  const fetchOnlineExecutivesData = async () => {
    setOnlineLoading(true);
    try {
      const data = await apiService.fetchOnlineExecutives();
      setOnlineExecutives(data);
    } catch (error) {
      console.error("Error fetching online executives:", error);
    } finally {
      setOnlineLoading(false);
    }
  };

  // ✅ Admin Profile
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchAdminProfile();

      if (data && data.username && data.email && data.role) {
        const mappedData = {
          name: data.username,
          email: data.email,
          role: data.role,
        };
        setAdminProfile(mappedData);
      } else {
        console.warn("⚠️ Unexpected API response format:", data);
      }
    } catch (error) {
      console.error("🔴 Error fetching admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Lead Section Visits
  const [visitData, setVisitData] = useState([]);
  const [visitLoading, setVisitLoading] = useState(false);

  const fetchLeadSectionVisitsAPI = async (executiveId) => {
    if (!executiveId) return;
    try {
      setVisitLoading(true);
      const data = await apiService.fetchLeadSectionVisits(executiveId);
      setVisitData(data.leadSectionVisits || []);
    } catch (error) {
      console.error("❌ Error fetching visits:", error);
    } finally {
      setVisitLoading(false);
    }
  };

  // ✅ File Upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const uploadFileAPI = async (file) => {
    if (!file) {
      setUploadError("Please select a file first!");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const response = await upload.uploadFile(file);
      setUploadSuccess("File uploaded successfully!");
      return response;
    } catch (error) {
      setUploadError(error.message || "File upload failed!");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // ✅ Fetch All Executives Activities
  const [topExecutive, setTopExecutive] = useState(null);

  const fetchExecutives = async () => {
    try {
      const executives = await apiService.fetchAllExecutivesActivities();
      if (executives.length > 0) {
        setTopExecutive(executives[0]);
      }
    } catch (error) {
      console.error("Error fetching executives:", error);
    }
  };

  // ✅ Notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const fetchNotifications = useCallback(async (userId) => {
    if (!userId) {
      console.warn("⚠️ User ID is required to fetch notifications");
      return;
    }

    setNotificationsLoading(true);
    try {
      const data = await apiService.fetchNotificationsByUser(userId);
      setNotifications(data || []);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const markNotificationReadAPI = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
      setNotifications(updated);
    } catch (error) {
      console.error("❌ Failed to mark notification as read", error);
    }
  };

  const deleteNotificationAPI = async (notificationId) => {
    try {
      await apiService.deleteNotificationById(notificationId);
      const filtered = notifications.filter((n) => n.id !== notificationId);
      setNotifications(filtered);
    } catch (error) {
      console.error("❌ Failed to delete notification", error);
    }
  };

  // ✅ Get Executive Activity
  const [activityData, setActivityData] = useState({
    breakTime: 0,
    workTime: 0,
    callTime: 0,
  });

  const getExecutiveActivity = async (executiveId) => {
    if (!executiveId) return;

    try {
      const data = await apiService.fetchExecutiveActivity(executiveId);
      setActivityData({
        breakTime: data.breakTime || 0,
        workTime: data.workTime || 0,
        callTime: data.callTime || 0,
      });
    } catch (error) {
      console.error("Error fetching executive activity data:", error);
    }
  };

  // ✅ Executive Dashboard Cards Total Count
  const [freshLeadsCount, setFreshLeadsCount] = useState(0);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [convertedClientsCount, setConvertedClientsCount] = useState(0);

  const fetchFreshLeads = async () => {
    try {
      const response = await apiService.fetchFreshLeads();
      const data = response.data;   
      const assignedLeads = data.filter(lead => lead.clientLead?.status === "Assigned");
        setFreshLeadsCount(assignedLeads.length); 
    } catch (error) {
      console.error("❌ Failed to fetch fresh leads:", error);
    }
  };   

  const fetchFollowUps = async () => {
    try {
      const response = await apiService.fetchAllFollowUps(); // <-- Corrected here
      const data = response.data;
  
      const followUpLeads = data.filter(lead => lead.clientLeadStatus === "Follow-Up");
  
      console.log("Filtered Follow-Up Leads:", followUpLeads);
  
      setFollowUpCount(followUpLeads.length);
    } catch (error) {
      console.error("❌ Failed to fetch follow-up leads:", error);
    }
  };
  
  const fetchConvertedClients = async () => {
    try {
      const response = await apiService.fetchConvertedClients(); 
      const data = response.data;
  
      const convertedClients = data.filter(lead => lead.status === "Converted");
  
      console.log("Filtered Converted Clients:", convertedClients);
  
      setConvertedClientsCount(convertedClients.length); 
    } catch (error) {
      console.error("❌ Failed to fetch converted clients:", error);
    }
  };  

  // ✅ Fetch Fresh Leads API
  const [freshLeads, setFreshLeads] = useState([]);
  const [freshLeadsLoading, setFreshLeadsLoading] = useState(false);

  const fetchFreshLeadsAPI = async () => {
    setFreshLeadsLoading(true);
    try {
      const data = await apiService.fetchFreshLeads();
      setFreshLeads(data || []);
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching fresh leads:", error);
      return [];
    } finally {
      setFreshLeadsLoading(false);
    }
  };

  // ✅ Update Fresh Lead FollowUp
  const updateFreshLeadFollowUp = async (leadId, updatedData) => {
    try {
      const response = await apiService.updateFreshLeadFollowUp(
        leadId,
        updatedData
      );
      return response;
    } catch (error) {
      console.error("❌ Error updating fresh lead follow-up:", error);
      throw error;
    }
  };

  const createFreshLeadAPI = async (leadData) => {
    try {
      const response = await apiService.createFreshLead(leadData);
      return response;
    } catch (error) {
      console.error("❌ Failed to create fresh lead:", error);
      throw error;
    }
  };

  // ✅ Create a new lead
  const createLeadAPI = async (leadData) => {
    try {
      const response = await apiService.createLeadAPI(leadData);

      if (response && response.id) {
        return response;
      } else {
        console.error("❌ Unexpected API response format:", response);
        throw new Error("Failed to create lead, invalid response format.");
      }
    } catch (error) {
      console.error(
        "❌ Error creating lead:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // ✅ State for follow-ups
  const [followUps, setFollowUps] = useState([]);
  const [followUpLoading, setFollowUpLoading] = useState(false);

  const getAllFollowUps = async () => {
    setFollowUpLoading(true);
    try {
      const data = await apiService.fetchAllFollowUps();
      setFollowUps(data);
    } catch (error) {
      console.error("❌ Failed to fetch follow-ups in context:", error);
    } finally {
      setFollowUpLoading(false);
    }
  };

  // ✅ Create a follow-up
  const createFollowUp = async (followUpData) => {
    try {
      const response = await apiService.createFollowUp(followUpData);
      return response;
    } catch (error) {
      console.error("❌ Error creating follow-up:", error);
      throw error;
    }
  };

  // ✅ Update Follow-Up
  const updateFollowUp = async (followUpId, updatedData) => {
    try {
      const response = await apiService.updateFollowUp(followUpId, updatedData);
      return response;
    } catch (error) {
      console.error("❌ Error updating follow-up:", error);
      throw error;
    }
  };

  // ✅ New: Create Follow-Up History
  const createFollowUpHistoryAPI = async (historyData) => {
    try {
      const response = await apiService.createFollowUpHistory(historyData);
      setFollowUpHistories((prev) => [...prev, response]);
      return response;
    } catch (error) {
      console.error("❌ Error creating follow-up history:", error);
      throw error;
    }
  };

  // ✅ New: Fetch Follow-Up Histories
  const fetchFollowUpHistoriesAPI = async () => {
    setFollowUpHistoriesLoading(true);
    try {
      const data = await apiService.fetchFollowUpHistories();
      setFollowUpHistories(data || []);
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching follow-up histories:", error);
      return [];
    } finally {
      setFollowUpHistoriesLoading(false);
    }
  };
  const [userSettings, setUserSettings] = useState(null); 

// Fetch user settings
const fetchSettings = async () => {
  try {
    const settings = await apiService.fetchUserSettings();  
    console.log("User Settings:", settings);
    setUserSettings(settings); 
  } catch (error) {
    console.error("Error fetching user settings:", error);
  }
};

// Update user settings
const updateSettings = async (updatedSettings) => {
  try {
    const updated = await apiService.updateUserSettings(updatedSettings); 
    console.log("Settings Updated:", updated);
    setUserSettings(updated); 
  } catch (error) {
    console.error("Error updating user settings:", error);
  }
};
const [meetings, setMeetings] = useState([]);

const refreshMeetings = async () => {
  const all = await apiService.fetchMeetings();  
  setMeetings(all);
  return all; 
}

const [convertedClients, setConvertedClients] = useState([]);
const [convertedClientsLoading, setConvertedClientsLoading] = useState(false);
// Create a new converted client
const createConvertedClientAPI = async (convertedData) => {
  try {
    const response = await apiService.createConvertedClient(convertedData);
    setConvertedClients((prev) => [...prev, response]);  // Add new one to list
    return response;
  } catch (error) {
    console.error("❌ Error creating converted client:", error);
    throw error;
  }
};

// Fetch all converted clients
const fetchConvertedClientsAPI = async () => {
  setConvertedClientsLoading(true);
  try {
    const response = await apiService.fetchConvertedClients(); 
    if (response && response.data && Array.isArray(response.data)) {
      setConvertedClients(response.data); 
    } else {
      console.error("❌ No data found in the response");
      setConvertedClients([]); 
    }
  } catch (error) {
    console.error("❌ Error fetching converted clients:", error);
    setConvertedClients([]); 
  } finally {
    setConvertedClientsLoading(false);
  }
};

 // Add state for Close Leads
 const [closeLeads, setCloseLeads] = useState([]);
 const [closeLeadsLoading, setCloseLeadsLoading] = useState(false);
 const [closeLeadsError, setCloseLeadsError] = useState(null);

 // ✅ Function to create Close Lead (POST)
 const createCloseLeadAPI = async (closeLeadData) => {
   try {
     const response = await apiService.createCloseLead(closeLeadData); 
     return response;
   } catch (error) {
     console.error("❌ Error creating close lead:", error);
     throw error;
   }
 };

 // ✅ Function to get all Close Leads (GET)
 const fetchAllCloseLeadsAPI = async () => {
   setCloseLeadsLoading(true);
   setCloseLeadsError(null);
   try {
     const data = await apiService.fetchAllCloseLeads();
     setCloseLeads(data || []); 
   } catch (error) {
     console.error("❌ Error fetching close leads:", error);
     setCloseLeadsError(error); 
   } finally {
     setCloseLeadsLoading(false);
   }
 };

  // ✅ Effect to fetch initial data
  useEffect(() => {
    fetchExecutiveData();
    fetchUserData();
    fetchOnlineExecutivesData();
    fetchAdmin();
    fetchLeadSectionVisitsAPI();
    fetchExecutives();
    fetchFreshLeads();
    fetchAllCloseLeadsAPI();
    fetchFollowUps();
    getAllFollowUps();
    fetchConvertedClients();
    getExecutiveActivity();
    fetchFollowUpHistoriesAPI(); 
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.id) {
      fetchNotifications(currentUser.id);
    }
  }, []);

  // ✅ API Functions
  const apiFunctions = {
    // Leads
    fetchLeadsAPI: apiService.fetchLeadsAPI,
    fetchAssignedLeads: apiService.fetchAssignedLeads,
    assignLeadAPI: apiService.assignLeadAPI,

    // Executives
    fetchExecutivesAPI: apiService.fetchExecutivesAPI,
    fetchExecutiveInfo: apiService.fetchExecutiveInfo,

    // Follow-ups
    fetchFollowUps,
    createFollowUp,
    fetchFreshLeadsAPI,
    
    createCloseLeadAPI,
    fetchAllCloseLeadsAPI,

    createConvertedClientAPI,
    fetchConvertedClientsAPI,
    // Follow-up Histories
    createFollowUpHistoryAPI,
    fetchFollowUpHistoriesAPI,
    // Meetings
 createMeetingAPI: apiService.createMeetingAPI, 
 fetchMeetings:    apiService.fetchMeetings,

 meetings,
 refreshMeetings

  };

  return (
    <ApiContext.Provider
      value={{
        // ✅ API functions
        ...apiFunctions,
        userSettings,
        fetchSettings,
        updateSettings,
        // ✅ Executive Info State
        executiveInfo,
        executiveLoading,
        fetchExecutiveData,
        createFreshLeadAPI,
        createLeadAPI,
        updateFreshLeadFollowUp,

        // ✅ Follow-ups
        followUps,
        followUpLoading,
        getAllFollowUps,
        updateFollowUp,

        closeLeads, // Add the state for Close Leads
        closeLeadsLoading,
        closeLeadsError,
        
        // ✅ Dashboard Counts
        freshLeadsCount,
        followUpCount,
        convertedClientsCount,
        fetchFreshLeads,
        fetchFollowUps,
        fetchConvertedClients,
        convertedClients,        
        convertedClientsLoading,
        // ✅ Fresh Leads
        freshLeads,
        freshLeadsLoading,
        fetchFreshLeadsAPI,

        // ✅ Notifications
        notifications,
        notificationsLoading,
        fetchNotifications,
        markNotificationReadAPI,
        deleteNotificationAPI,

        // ✅ User state
        user,
        setUser,
        userLoading,
        fetchUserData,

        // ✅ Online Executives
        onlineExecutives,
        onlineLoading,
        fetchOnlineExecutivesData,

        // ✅ Admin Profile
        adminProfile,
        loading,
        fetchAdmin,

        // ✅ Lead Section Visits
        visitData,
        fetchLeadSectionVisitsAPI,
        visitLoading,

        // ✅ File Upload
        uploadFileAPI,
        uploading,
        uploadError,
        uploadSuccess,

        // ✅ Top Executive
        topExecutive,
        fetchExecutives,

        // ✅ Executive Activity
        activityData,
        getExecutiveActivity,

        // ✅ Follow-up Histories
        followUpHistories,
        followUpHistoriesLoading,
        fetchFollowUpHistoriesAPI,
        createFollowUpHistoryAPI,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
