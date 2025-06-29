import React, { createContext, useContext, useState, useEffect ,useMemo} from "react";
import * as apiService from "../services/apiService";
import * as upload from "../services/fileUpload";
import { useCallback } from "react";
import {updateAdminProfile,changeAdminPassword,createEmailTemplate,getAllEmailTemplates,
  getEmailTemplateById,markMultipleNotificationsAsRead,fetchFollowUpHistoryByLeadId,createTeam,getManagerTeams,
  addExecutiveToTeam
} from "../services/apiService"
import { format } from "date-fns";
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

  const fetchUserData = async () => {
    setUserLoading(true);
    try {
      const response = await apiService.fetchAdminProfile();
      const { username, email, role } = response; // ✅ NOT `response.data` because `fetchAdminProfile` already returns `response.data`
      setUser({ username, email, role });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setUserLoading(false);
    }
  };
  
  
    const [isProfileUpdating, setProfileUpdating] = useState(false);
    const [isPasswordUpdating, setPasswordUpdating] = useState(false);
  
    // Update profile
    const handleUpdateProfile = async (profileData) => {
      setProfileUpdating(true);
      try {
        const updatedData = await updateAdminProfile(profileData);
        return updatedData;
      } catch (error) {
        console.error("❌ Error updating admin profile:", error);
        throw error;
      } finally {
        setProfileUpdating(false);
      }
    };
  
    // Change password
    const handleChangePassword = async (currentPassword, newPassword) => {
      setPasswordUpdating(true);
      try {
        const result = await changeAdminPassword(currentPassword, newPassword);
        return result;
      } catch (error) {
        console.error("❌ Error changing admin password:", error);
        throw error;
      } finally {
        setPasswordUpdating(false);
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

  const [activityData, setActivityData] = useState({
    breakTime: 0,
    workTime: 0,
    callTime: 0,
  });

  // ✅ Get Executive Activity - Updated to filter by current date
  const getExecutiveActivity = async (executiveId) => {
    if (!executiveId) return;

    try {
      const data = await apiService.fetchExecutiveActivity(executiveId);
      
      // Get today's date in YYYY-MM-DD format
      const today = format(new Date(), "yyyy-MM-dd");

      // Filter activities for today only
      let totalBreakTime = 0;
      let totalWorkTime = 0;
      let totalCallTime = 0;

      if (Array.isArray(data)) {
        // Filter and sum records for today
        const todayActivities = data.filter(record => record.activityDate === today);
        todayActivities.forEach(record => {
          totalBreakTime += record.breakTime || 0;
          totalWorkTime += record.workTime || 0;
          totalCallTime += record.dailyCallTime || 0;
        });
      } else if (data && typeof data === 'object') {
        // Handle single object response for today
        if (data.activityDate === today) {
          totalBreakTime = data.breakTime || 0;
          totalWorkTime = data.workTime || 0;
          totalCallTime = data.dailyCallTime || 0;
        }
      }

      setActivityData({
        breakTime: totalBreakTime,
        workTime: totalWorkTime,
        callTime: totalCallTime,
      });

      console.log('✅ Activity totals for today:', {
        totalWorkTime,
        totalBreakTime,
        totalCallTime
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
const useFollowUpHistory = () => {
  const getFollowUpHistory = useCallback(async (freshLeadId) => {
    try {
      const history = await fetchFollowUpHistoryByLeadId(freshLeadId);
      return history;
    } catch (error) {
      console.error("❌ Error fetching follow-up history:", error);
      return [];
    }
  }, []);

  return { getFollowUpHistory };
};
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
const updateClientLead = async (clientLeadId, updateFields) => {
  try {
    const response = await apiService.updateClientLead(clientLeadId, updateFields);
    return response;
  } catch (error) {
    console.error("Error updating client lead in context:", error);
    throw error;
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
const updateClientLeadsadmin = async (leadId, updatedData) => {
  try {
    const response = await apiService.updateClientLeads(leadId, updatedData);
    return response;
  } catch (error) {
    console.error("❌ Error updating client lead in context:", error);
    throw error;
  }
};

const deleteClientLead = async (leadId) => {
  try {
    const response = await apiService.deleteClientLead(leadId);
    return response;
  } catch (error) {
    console.error("❌ Error deleting client lead in context:", error);
    throw error;
  }
};
const createHr = async (hrData) => {
  setLoading(true);
  
  try {
    const result = await apiService.createHrApi(hrData);
    return result;
  } catch (err) {

    throw err;
  } finally {
    setLoading(false);
  }
};
const getHrProfile = async () => {
  try {
    const response = await apiService.getHr(); 
    return response.hr;
  } catch (error) {
    console.error("❌ Error creating close lead:", error);
    throw error;
  }
};
 const getManagerProfile = async () => {
  try {
    const response = await apiService.getManager(); 
    return response.manager;
  } catch (error) {
    console.error("❌ Error creating close lead:", error);
    throw error;
  }
};
const fetchAllExecutiveActivitiesByDateAPI = async () => {
  setExecutiveDashboardLoading(true);
  try {
    const data = await apiService.fetchAllExecutiveActivitiesByDate();

    const wrapped = { dailyActivities: data || {} }; // ✅ wrap in expected format

    setExecutiveDashboardData((prev) => ({
      ...prev,
      ...wrapped,
    }));

    return wrapped; // ✅ return in correct structure
  } catch (error) {
    console.error("❌ Error fetching all executive activities by date:", error);
    const empty = { dailyActivities: {} };

    setExecutiveDashboardData((prev) => ({
      ...prev,
      ...empty,
    }));

    return empty;
  } finally {
    setExecutiveDashboardLoading(false);
  }
};

const getAllProfile = async () => {
  try {
    const response = await apiService.getUserProfile(); 
    return response;
  } catch (error) {
    console.error("❌ Error creating close lead:", error);
    throw error;
  }
};
const [templateLoading, setTemplateLoading] = useState(false);
const [templateSuccess, setTemplateSuccess] = useState(false);
const [templateError, setTemplateError] = useState(null);
const handleCreateTemplate = useCallback(async (templateData) => {
  setTemplateLoading(true);
  setTemplateSuccess(false);
  setTemplateError(null);
  try {
    await createEmailTemplate(templateData);
    setTemplateSuccess(true);
  } catch (error) {
    setTemplateError(error);
  } finally {
    setTemplateLoading(false);
  }
}, []);


const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);


  // ✅ Fetch all templates
  const fetchAllTemplates = useCallback(async () => {
    setTemplateLoading(true);
    setTemplateError(null);
    try {
      const templates = await getAllEmailTemplates();
      setEmailTemplates(templates);
    } catch (error) {
      setTemplateError(error);
    } finally {
      setTemplateLoading(false);
    }
  }, []);

  // ✅ Fetch a single template by ID
  const fetchTemplateById = useCallback(async (templateId) => {
    setTemplateLoading(true);
    setTemplateError(null);
    try {
      const template = await getEmailTemplateById(templateId);
      setSelectedTemplate(template);
      return template;
    } catch (error) {
      setTemplateError(error);
      throw error;
    } finally {
      setTemplateLoading(false);
    }
  }, []);
  const [markLoading, setMarkLoading] = useState(false);
  const [markError, setMarkError] = useState(null);

  const markMultipleAsRead = useCallback(async (notificationIds) => {
    setMarkLoading(true);
    setMarkError(null);
    try {
      const result = await markMultipleNotificationsAsRead(notificationIds);
      return result;
    } catch (error) {
      setMarkError(error);
      throw error;
    } finally {
      setMarkLoading(false);
    }
  }, []);

  const fetchExecutiveCallDurations = async (executiveId) => {
    try {
      const { weeklyData } = await apiService.fetchExecutiveCallDurations(executiveId);
      return { weeklyData }; // ✅ clean return
    } catch (error) {
      console.error("❌ Error fetching executive call durations:", error);
      return { weeklyData: [0, 0, 0, 0, 0, 0, 0] };
    }
  };

  
  // Create a new leave application
  const createLeaveApplication = async (leaveData) => {
    try {
      const response = await apiService.createLeaveApplication(leaveData);
      return response;
    } catch (error) {
      console.error("❌ Failed to create leave application:", error);
      throw error;
    }
  };

    // New state for leave applications
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveApplicationsLoading, setLeaveApplicationsLoading] = useState(false);

  // New function to fetch leave applications
  const fetchLeaveApplicationsAPI = async (employeeId = null) => {
    setLeaveApplicationsLoading(true);
    try {
      const data = await apiService.fetchLeaveApplications(employeeId);
      setLeaveApplications(data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching leave applications:", error);
      return [];
    } finally {
      setLeaveApplicationsLoading(false);
    }
  };

  // New function to update leave status
  const updateLeaveStatusAPI = async (leaveId, status) => {
    try {
      const response = await apiService.updateLeaveApplicationStatus(leaveId, status);
      setLeaveApplications(prev => 
        prev.map(app => app.id === leaveId ? { ...app, status } : app)
      );
      return response;
    } catch (error) {
      console.error("❌ Error updating leave status:", error);
      throw error;
    }
  };  
  const [allHRs, setAllHRs] = useState([]);
  const [allHRsLoading, setAllHRsLoading] = useState(false);
  
  const [allManagers, setAllManagers] = useState([]);
  const [allManagersLoading, setAllManagersLoading] = useState(false);
  
  const [allProcessPersons, setAllProcessPersons] = useState([]);
  const [allProcessPersonsLoading, setAllProcessPersonsLoading] = useState(false);
  const fetchAllHRsAPI = async () => {
    setAllHRsLoading(true);
    try {
      const data = await apiService.fetchAllHRs();
      setAllHRs(data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching HRs:", error);
      return [];
    } finally {
      setAllHRsLoading(false);
    }
  };
  
  const fetchAllManagersAPI = async () => {
    setAllManagersLoading(true);
    try {
      const data = await apiService.fetchAllManagers();
      setAllManagers(data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching Managers:", error);
      return [];
    } finally {
      setAllManagersLoading(false);
    }
  };
  
  const fetchAllProcessPersonsAPI = async () => {
    setAllProcessPersonsLoading(true);
    try {
      const data = await apiService.fetchAllProcessPersons();
      setAllProcessPersons(data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching Process Persons:", error);
      return [];
    } finally {
      setAllProcessPersonsLoading(false);
    }
  };
  const [allTeamLeads, setAllTeamLeads] = useState([]);
  const [allTeamLeadsLoading, setAllTeamLeadsLoading] = useState(false);
  const fetchAllTeamLeadsAPI = async () => {
    setAllTeamLeadsLoading(true);
    try {
      const data = await apiService.fetchAllTeamLeads();
      setAllTeamLeads(data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching Team Leads:", error);
      return [];
    } finally {
      setAllTeamLeadsLoading(false);
    }
  };
    
  const [managerTeams, setManagerTeams] = useState([]);
  const [managerTeamsLoading, setManagerTeamsLoading] = useState(false);
  const [managerTeamsError, setManagerTeamsError] = useState(null);
// ✅ Create a new team
const createManagerTeam = async (teamData) => {
  try {
    const response = await createTeam(teamData);
    // Optional: Add new team to state
    setManagerTeams((prev) => [...prev, response]);
    return response;
  } catch (error) {
    console.error("❌ Error creating manager team:", error);
    throw error;
  }
};

// ✅ Fetch manager's teams
const fetchManagerTeams = async () => {
  setManagerTeamsLoading(true);
  setManagerTeamsError(null);
  try {
    const teams = await getManagerTeams();
    setManagerTeams(teams);
    return teams;
  } catch (error) {
    console.error("❌ Error fetching manager teams:", error);
    setManagerTeamsError(error);
    return [];
  } finally {
    setManagerTeamsLoading(false);
  }
};

// ✅ Add executive to a team
const assignExecutiveToTeam = async ({ teamId, executiveId }) => {
  try {
    const response = await addExecutiveToTeam({ teamId, executiveId });
    return response;
  } catch (error) {
    console.error("❌ Error assigning executive to team:", error);
    throw error;
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
    fetchExecutiveActivity: apiService.fetchExecutiveActivity, // Added
    fetchAllExecutivesActivities: apiService.fetchAllExecutivesActivities, // Added
    fetchAllExecutiveActivitiesByDateAPI,
    fetchExecutivesAPI: apiService.fetchExecutivesAPI,
    fetchExecutiveInfo: apiService.fetchExecutiveInfo,
    sendEodReport: apiService.sendEodReport,
    createSingleLeadAPI,
    updateUserLoginStatus,
    // Follow-ups
    createFollowUp,
    fetchFreshLeadsAPI,
    updateMeetingAPI,
    updateClientLead,
  
    createCloseLeadAPI,
    fetchAllCloseLeadsAPI,
    fetchExecutiveCallDurations,
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
 fetchDealFunnelData: apiService.fetchDealFunnelData,

 createLeaveApplication,
 // New leave application functions
   fetchLeaveApplicationsAPI,
   updateLeaveStatusAPI,
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
        allTeamLeads,
allTeamLeadsLoading,
fetchAllTeamLeadsAPI,

        updateFreshLeadFollowUp,
        executiveDashboardData,
        executiveDashboardLoading,
        fetchExecutiveDashboardData,
        adminMeeting,
        convertedCustomerCount, // ✅ add this
    setConvertedCustomerCount, // ✅ and this
    createManager,
    updateClientLeadsadmin,
    deleteClientLead,
    getAllProfile,
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
        setNotifications,
        createCopyNotification,
      markNotificationReadAPI,
        deleteNotificationAPI,
        getManagerProfile,
        revenueChartData,
        revenueChartLoading,
        fetchRevenueChartDataAPI,
        // ✅ User state
        user,
        setUser,
        userLoading,
        fetchUserData,
        getHrProfile,
        // ✅ Online Executives
        onlineExecutives,
        onlineLoading,
        fetchOnlineExecutivesData,
        managerTeams,
        managerTeamsLoading,
        managerTeamsError,
        createManagerTeam,
        fetchManagerTeams,
        assignExecutiveToTeam,
        
        // ✅ Admin Profile
        adminProfile,
        loading,
        fetchAdmin,
        emailTemplates,
        selectedTemplate,
        fetchAllTemplates,
        fetchTemplateById,
        // ✅ Lead Section Visits
        visitData,
        fetchLeadSectionVisitsAPI,
        visitLoading,
        createHr,
        ...useFollowUpHistory(),
        // ✅ File Upload
        uploadFileAPI,
        uploading,
        uploadError,
        uploadSuccess,
        handleChangePassword,
        handleUpdateProfile,
        isProfileUpdating,
        setProfileUpdating,
        isPasswordUpdating,
        setPasswordUpdating,
        // ✅ Top Executive
        topExecutive,
        fetchExecutives,
        handleCreateTemplate,
        templateLoading,
        templateSuccess,
        templateError,
        // ✅ Executive Activity
        activityData,
        getExecutiveActivity,
        fetchConvertedClientsAPI,
        markMultipleAsRead,
        markLoading,
        markError,
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

              // New leave applications context
              leaveApplications,
              leaveApplicationsLoading,
              fetchLeaveApplicationsAPI,
              updateLeaveStatusAPI,
              // HR, Manager, and Process Person Data
              allHRs,
              allHRsLoading,
              fetchAllHRsAPI,

              allManagers,
              allManagersLoading,
              fetchAllManagersAPI,

              allProcessPersons,
              allProcessPersonsLoading,
              fetchAllProcessPersonsAPI,

              
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
