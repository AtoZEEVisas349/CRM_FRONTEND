import React, { createContext, useContext, useState, useEffect ,useMemo} from "react";
import * as apiService from "../services/apiService";
import * as upload from "../services/fileUpload";
import { useCallback } from "react";
import * as executiveService from "../services/executiveService";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
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
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.is_read).length,
    [notifications]
  );
  const fetchNotifications = useCallback(async ({ userId, userRole }) => {
    if (!userId || !userRole) {
      console.warn(
        "⚠️ User ID and User Role is required to fetch notifications"
      );
      return;
    }

    setNotificationsLoading(true);
    try {
      const data = await apiService.fetchNotificationsByUser({
        userId,
        userRole,
      });
      setNotifications(data || []);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const createCopyNotification = async (userId, userRole, message) => {
    try {
      await apiService.createCopyNotification({ userId, userRole, message });
      fetchNotifications({userId,userRole});
    } catch (error) {
      console.error("❌ Failed to create copy notification:", error);
    }
  };

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
      return data || [];
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
    setUserSettings(settings); 
  } catch (error) {
    console.error("Error fetching user settings:", error);
  }
};

// Update user settings
const updateSettings = async (updatedSettings) => {
  try {
    const updated = await apiService.updateUserSettings(updatedSettings); 
    setUserSettings(updated); 
  } catch (error) {
    console.error("Error updating user settings:", error);
  }
};
const [meetings, setMeetings] = useState([]);
const [meetingsLoading, setMeetingsLoading] = useState(false);


const refreshMeetings = async () => {
  const all = await apiService.fetchMeetings();  
  setMeetings(all);
  return all; 
}
const adminMeeting = useCallback(async () => {
  try {
    const meetings = await apiService.adminMeeting();
    return meetings;
  } catch (error) {
    console.error("❌ Error fetching meetings:", error);
    return [];
  }
}, []);

const [readMeetings, setReadMeetings] = useState(() => {
  const stored = localStorage.getItem("readMeetings");
  return stored ? JSON.parse(stored) : {};
});
const markMeetingAsRead = (meetingId) => {
  setReadMeetings((prev) => {
    const updated = { ...prev, [meetingId]: true };
    localStorage.setItem("readMeetings", JSON.stringify(updated));
    return updated;
  });
};
const unreadMeetingsCount = useMemo(() => {
  return meetings.filter((m) => !readMeetings[m.id]).length;
}, [meetings, readMeetings]);

// ✅ Preload meetings for global access (for bell icon count)
useEffect(() => {
  const preloadMeetings = async () => {
    try {
      const data = await adminMeeting(); // already defined
      setMeetings(data || []);
    } catch (err) {
      console.error("❌ Error preloading meetings for unread count:", err);
    }
  };

  preloadMeetings();
}, []);

const [convertedCustomerCount, setConvertedCustomerCount] = useState(0);
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
      return response.data;
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

 const [executiveDashboardData, setExecutiveDashboardData] = useState([]);
 const [executiveDashboardLoading, setExecutiveDashboardLoading] = useState(false);

  const fetchExecutiveDashboardData = async () => {
    setExecutiveDashboardLoading(true);
    try {
      const data = await apiService.fetchAdminExecutiveDashboard(); // already defined in your services
      setExecutiveDashboardData(data || []);
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching executive dashboard data:", error);
      return [];
    } finally {
      setExecutiveDashboardLoading(false);
    }
  };
const [opportunities, setOpportunities] = useState([]);
const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);

  const fetchOpportunitiesData = async () => {
    setOpportunitiesLoading(true);
    try {
      const data = await apiService.fetchOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error("❌ Error fetching opportunities:", error);
    } finally {
      setOpportunitiesLoading(false);
    }
  };

 const [dealFunnel, setDealFunnel] = useState(null);
 
  const getDealFunnel = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchDealFunnelData();
      setDealFunnel(data);
    } catch (error) {
      console.error("❌ Context error fetching deal funnel:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Revenue Chart Data State
const [revenueChartData, setRevenueChartData] = useState([]);
const [revenueChartLoading, setRevenueChartLoading] = useState(false);

const fetchRevenueChartDataAPI = async () => {
  setRevenueChartLoading(true);
  try {
    const data = await apiService.fetchRevenueChartData();
    setRevenueChartData(data || []);
    return data || [];
  } catch (error) {
    console.error("❌ Error fetching revenue chart data:", error);
    return [];
  } finally {
    setRevenueChartLoading(false);
  }
};

// Add updateUserLoginStatus to ApiContext
const updateUserLoginStatus = async (userId, canLogin) => {
  try {
    const response = await apiService.updateUserLoginStatus(userId, canLogin);
    return response;
  } catch (error) {
    console.error(`❌ Error in ApiContext updating login status for user ${userId}:`, error);
    throw error;
    }
  };
const [verificationResults, setVerificationResults] = useState({});
const [verificationLoading, setVerificationLoading] = useState(false);

const verifyNumberAPI = async (index, phone) => {
  setVerificationLoading(true);
  try {
    const data = await apiService.verifyNumber(phone);
    setVerificationResults((prev) => ({
      ...prev,
      [index]: data.success
        ? {
            name: data.name,
            location: data.location,
          }
        : {
            error: data.error || "Lookup failed",
          },
    }));
    return data;
  } catch (error) {
    console.error("❌ Error verifying number:", error);
    setVerificationResults((prev) => ({
      ...prev,
      [index]: { error: "Network error" },
    }));
    return null;
  } finally {
    setVerificationLoading(false);
  }
};
// Update Meeting
const updateMeetingAPI = async (meetingId, updatedData) => {
  try {
    const response = await apiService.updateMeeting(meetingId, updatedData);
    setMeetings((prevMeetings) => {
      const updatedMeetings = prevMeetings.map((meeting) =>
        meeting.id === meetingId ? { ...meeting, ...response } : meeting
      );
      return updatedMeetings;
    });
    return response; // Return the updated meeting data
  } catch (error) {
    console.error("❌ Error updating meeting:", error);
    throw error;
  }
};
const updateClientLeadStatus = async (leadId, status) => {
  try {
    const response = await apiService.updateClientLeadStatus(leadId, status);
    return response;
  } catch (error) {
    console.error("❌ Error updating client lead status:", error);
    throw error;
  }
};
const createExecutive = async (executiveData) => {
  setLoading(true);
  
  try {
    const result = await apiService.createExecutiveAPI(executiveData);
    return result;
  } catch (err) {

    throw err;
  } finally {
    setLoading(false);
  }
};
const [followUpClients, setFollowUpClients] = useState([]);
const [followUpClientsLoading, setFollowUpClientsLoading] = useState(false);
const fetchFollowUpClientsAPI = async () => {
  setFollowUpClientsLoading(true);
  try {
    const data = await apiService.fetchFollowUpLeadsAPI();
    setFollowUpClients(data || []);
    return data || [];
  } catch (error) {
    console.error("❌ Error fetching follow-up clients:", error);
    return [];
  } finally {
    setFollowUpClientsLoading(false);
  }
};
const [allClientsLoading, setallClientsLoading] = useState(false);
const[allClients,setAllClients]=useState();
  const fetchAllClients= async () => {
    setallClientsLoading(true);
    try {
      const data = await apiService.fetchAllClientLeads(); // already defined in your services
      setAllClients(data|| [])
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching executive dashboard data:", error);
      return [];
    } finally {
      setallClientsLoading(false);
    }
  };
  
const createSingleLeadAPI = async (leadData) => {
  if (!leadData || !leadData.name) {
    setUploadError("Name is required for lead creation!");
    throw new Error("Name is required for lead creation!");
  }

  setUploading(true);
  setUploadError("");
  setUploadSuccess("");

  try {
    const response = await upload.uploadFile(leadData);
    setUploadSuccess("Lead created successfully!");
    return response;
  } catch (error) {
    setUploadError(error.message || "Failed to create lead!");
    throw error;
  } finally {
    setUploading(false);
  }
};

const createTeamLead = async (teamData) => {
  setLoading(true);
  
  try {
    const result = await apiService.createTeamLeadApi(teamData);
    return result;
  } catch (err) {

    throw err;
  } finally {
    setLoading(false);
  }
};
const createAdmin = async (adminData) => {
  setLoading(true);
  
  try {
    const result = await apiService.createAdminApi(adminData);
    return result;
  } catch (err) {

    throw err;
  } finally {
    setLoading(false);
  }
};
const createManager = async (managerData) => {
  setLoading(true);
  
  try {
    const result = await apiService.createManagerApi(managerData);
    return result;
  } catch (err) {

    throw err;
  } finally {
    setLoading(false);
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
    fetchAllCloseLeadsAPI();
    getExecutiveActivity();
    fetchFollowUpHistoriesAPI(); 
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.id) {
      fetchNotifications(currentUser.id);
    }
  }, []);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
  
    if (token && currentUser?.username) {
      getAllFollowUps();    // ✅ moved here safely
      fetchFreshLeadsAPI();
    } else {
      console.warn("⛔ Token or user info missing. Skipping follow-up fetch.");
    }
  }, []);
  // ✅ API Functions
  const apiFunctions = {
    // Leads
    fetchLeadsAPI: apiService.fetchLeadsAPI,
    fetchAssignedLeads: apiService.fetchAssignedLeads,
    assignLeadAPI: apiService.assignLeadAPI,
    reassignLead:apiService.reassignLead,
    // Executives
    fetchExecutivesAPI: apiService.fetchExecutivesAPI,
    fetchExecutiveInfo: apiService.fetchExecutiveInfo,
    sendEodReport: apiService.sendEodReport,
    createSingleLeadAPI,
    updateUserLoginStatus,
    // Follow-ups
    updateClientLeadStatus,
    createFollowUp,
    fetchFreshLeadsAPI,
    updateMeetingAPI,
    
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
 refreshMeetings,
 fetchDealFunnelData: apiService.fetchDealFunnelData
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
        unreadMeetingsCount,
        readMeetings,
        markMeetingAsRead,
        unreadMeetingsCount,
        fetchExecutiveData,
        createFreshLeadAPI,
        createLeadAPI,
        updateFreshLeadFollowUp,
        executiveDashboardData,
        executiveDashboardLoading,
        fetchExecutiveDashboardData,
        adminMeeting,
        convertedCustomerCount, // ✅ add this
    setConvertedCustomerCount, // ✅ and this
    createManager,
        // ✅ Follow-ups
        followUps,
        followUpLoading,
        getAllFollowUps,
        updateFollowUp,
        fetchAllClients,
        verifyNumberAPI,
      verificationResults,
      verificationLoading,
      followUpClients,
      followUpClientsLoading,
      fetchFollowUpClientsAPI,
      createAdmin,
        createTeamLead,
        closeLeads, // Add the state for Close Leads
        closeLeadsLoading,
        closeLeadsError,
        
        // ✅ Dashboard Counts
        convertedClients,        
        convertedClientsLoading,
        // ✅ Fresh Leads
        freshLeads,
        freshLeadsLoading,
        fetchFreshLeadsAPI,
        createExecutive,
        // ✅ Notifications
        notifications,
        notificationsLoading,
        unreadCount,
        fetchNotifications,
        createCopyNotification,
      markNotificationReadAPI,
        deleteNotificationAPI,

        revenueChartData,
        revenueChartLoading,
        fetchRevenueChartDataAPI,
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
        fetchConvertedClientsAPI,
        
        opportunities,
        opportunitiesLoading,
        fetchOpportunitiesData,
        getDealFunnel,
        dealFunnel,
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
