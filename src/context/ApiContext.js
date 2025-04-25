import React, { createContext, useContext, useState, useEffect } from "react";
import * as apiService from "../services/apiService";
import * as upload from "../services/fileUpload";
import { useCallback } from "react"; // Add this at the top
import * as executiveService from "../services/executiveService"
const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // ✅ Existing state
  const [executiveInfo, setExecutiveInfo] = useState(null);
  const [executiveLoading, setExecutiveLoading] = useState(false);

  // ✅ New: User state
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [userLoading, setUserLoading] = useState(false);
 
  // ✅ Online Executives state
 const [onlineExecutives, setOnlineExecutives] = useState([]);
 const [onlineLoading, setOnlineLoading] = useState(false);

  // ✅ Fetch executive data (already existing)
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
        setExecutiveInfo(response.data.executive); // Set executiveInfo
      } else {
        console.error("Executive data missing:", response.data);
      }
    } catch (error) {
      console.error("Error fetching executive data:", error);
    } finally {
      setExecutiveLoading(false);
    }
  };
  

  // ✅ New: Fetch user data
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

//adminProfile
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

  //fetchleadSectionVisit
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

  //fileupload
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

//fetchAllExecutivesActivities
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

// ✅ Fetch notifications for current user
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

// ✅ Mark Notification as Read
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

// ✅ Delete Notification
const deleteNotificationAPI = async (notificationId) => {
  try {
    await apiService.deleteNotificationById(notificationId);
    const filtered = notifications.filter((n) => n.id !== notificationId);
    setNotifications(filtered);
  } catch (error) {
    console.error("❌ Failed to delete notification", error);
  }
};


  //getExecutiveActivity
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

  //Executive Dashboard cards total count
  const [freshLeadsCount, setFreshLeadsCount] = useState(0);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [convertedClientsCount, setConvertedClientsCount] = useState(0);
  
  const fetchFreshLeads = async () => {
    try {
      const count = await apiService.fetchFreshLeadsCount();
      setFreshLeadsCount(count);
    } catch (error) {
      console.error("❌ Failed to fetch fresh leads count:", error);
    }
  };
  
  const fetchFollowUps = async () => {
    try {
      const count = await apiService.fetchFollowUpCount();
      setFollowUpCount(count);
    } catch (error) {
      console.error("❌ Failed to fetch follow-up count:", error);
    }
  };
  
  const fetchConvertedClients = async () => {
    try {
      const count = await apiService.fetchConvertedClientsCount();
      setConvertedClientsCount(count);
    } catch (error) {
      console.error("❌ Failed to fetch converted clients count:", error);
    }
  };
 
  // ✅ New: Fetch Fresh Leads API
const [freshLeads, setFreshLeads] = useState([]);
const [freshLeadsLoading, setFreshLeadsLoading] = useState(false);

const fetchFreshLeadsAPI = async () => {
  setFreshLeadsLoading(true);
  try {
    const data = await apiService.fetchFreshLeads();
    setFreshLeads(data || []);        // ✅ set context state
    return data || [];                // ✅ return array
  } catch (error) {
    console.error("❌ Error fetching fresh leads:", error);
    return []; // ✅ fallback to empty array
  } finally {
    setFreshLeadsLoading(false);
  }
};

// ✅ Update Fresh Lead FollowUp
const updateFreshLeadFollowUp = async (leadId, updatedData) => {
  try {
    const response = await apiService.updateFreshLeadFollowUp(leadId, updatedData);
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
  
    // ✅ New: Create a new lead
    const createLeadAPI = async (leadData) => {
      try {
        const response = await apiService.createLeadAPI(leadData); // API call
    
        if (response && response.id) { // Check for the lead id directly in response
          return response; // Return the created lead data
        } else {
          console.error("❌ Unexpected API response format:", response);
          throw new Error("Failed to create lead, invalid response format.");
        }
      } catch (error) {
        console.error("❌ Error creating lead:", error.response?.data || error.message); // Better error logging
        throw error; // Re-throw the error to be handled by the calling function
      }
    };
  
    //State for followup
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

  useEffect(() => {
    fetchExecutiveData();
    fetchUserData(); // ✅ Fetch user data on mount
    fetchOnlineExecutivesData();
    fetchAdmin();
    fetchLeadSectionVisitsAPI();
    fetchExecutives();
    fetchFreshLeads();
    fetchFollowUps();
    getAllFollowUps();
    fetchConvertedClients();
    getExecutiveActivity();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.id) {
      fetchNotifications(currentUser.id);
    }
  }, []);
  const apiFunctions = {
    // Leads
    fetchLeadsAPI: apiService.fetchLeadsAPI,
    fetchAssignedLeads: apiService.fetchAssignedLeads,
    assignLeadAPI: apiService.assignLeadAPI,

    // Executives
    fetchExecutivesAPI: apiService.fetchExecutivesAPI,
    fetchExecutiveInfo: apiService.fetchExecutiveInfo,
    //All follow up
    fetchFollowUps, 
    createFollowUp, 
    fetchFreshLeadsAPI,

    // Executive Activity
    // fetchAllExecutivesActivities: apiService.fetchAllExecutivesActivities,
    // fetchExecutiveActivity: apiService.fetchExecutiveActivity,
    // fetchLeadSectionVisits: apiService.fetchLeadSectionVisits,
  };

  return (
    <ApiContext.Provider
      value={{
        // ✅ API functions
        ...apiFunctions,

        // ✅ Executive Info State
        executiveInfo,
        executiveLoading,
        fetchExecutiveData,
        createFreshLeadAPI,
        createLeadAPI,  // Expose the new function in context
        
        updateFreshLeadFollowUp,

        followUps,
        followUpLoading,
        getAllFollowUps,
        updateFollowUp,

        freshLeadsCount,
        followUpCount,
        convertedClientsCount,
        fetchFreshLeads,
        fetchFollowUps,
        fetchConvertedClients,
        
        freshLeads,
        freshLeadsLoading,
        fetchFreshLeadsAPI,
        //notification
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
         //
         adminProfile,
         loading,
         fetchAdmin,
         //
         visitData, fetchLeadSectionVisitsAPI, visitLoading,
         //fileupload
         uploadFileAPI, uploading, uploadError, uploadSuccess,
         //
         topExecutive, fetchExecutives ,
         //
         activityData,
         getExecutiveActivity,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
