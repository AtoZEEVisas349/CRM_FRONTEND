//apiSericce.js
import axios from "axios";

// ✅ Define API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// Create an Axios instance with base settings
const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token to requests (if available)
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Function to fetch all leads
export const fetchLeadsAPI = async () => {
  try {
    const response = await apiService.get("/client-leads/getClients");
    return response.data.leads;
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    throw error;
  }
};

// ✅ Function to fetch assigned leads by executive name
export const fetchAssignedLeads = async (executiveName) => {
  try {
    if (!executiveName) {
      console.error("🚨 Executive name is missing!");
      throw new Error("Executive name not provided!");
    }
    const response = await apiService.get(
      `/client-leads/executive?executiveName=${executiveName}`
    );
    return response.data.leads;
  } catch (error) {
    console.error("❌ Error fetching assigned leads:", error);
    throw error;
  }
};

// ✅ Fetch notifications for a specific user (executive)
export const fetchNotificationsByUser = async (userId) => {
  try {
    const response = await apiService.get(`/notification/user/${userId}`);
    return response.data.notifications;
  } catch (error) {
    console.error(`❌ Error fetching notifications for user ${userId}:`, error);
    throw error;
  }
};

// ✅ Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiService.put(
      `/notification/mark-read/${notificationId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error marking notification ${notificationId} as read:`,
      error
    );
    throw error;
  }
};

// ✅ Delete a notification
export const deleteNotificationById = async (notificationId) => {
  try {
    const response = await apiService.delete(`/notification/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting notification ${notificationId}:`, error);
    throw error;
  }
};

// ✅ Function to fetch all executives
export const fetchExecutivesAPI = async () => {
  try {
    const response = await apiService.get("/executives");
    return response.data.executives;
  } catch (error) {
    console.error("❌ Error fetching executives:", error);
    throw error;
  }
};
// ✅ Fetch executive details by ID
export const fetchExecutiveInfo = async (executiveId) => {
  try {
    const response = await apiService.get(`/executives/${executiveId}`);
    return response;
  } catch (error) {
    console.error("API error in fetchExecutiveInfo:", error);
    throw error;
  }
};
// ✅ Fetch online executives
export const fetchOnlineExecutives = async () => {
  try {
    const response = await apiService.get("/online");
    return response.data.onlineExecutives;
  } catch (error) {
    console.error("❌ Error fetching online executives:", error);
    throw error;
  }
};

// ✅ Fetch admin profile
export const fetchAdminProfile = async () => {
  try {
    const response = await apiService.get("/admin/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};

// ✅ Function to assign leads to an executive
export const assignLeadAPI = async (leadId, executiveId, executiveName) => {
  try {
    const response = await apiService.put(
      `/client-leads/assign-executive/${leadId}`,
      {
        executiveId,
        executiveName,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error assigning Lead ID ${leadId}:`, error);
    throw error;
  }
};
// ================== 📊 Executive Activity APIs ==================

// ✅ Fetch all executive activities
export const fetchAllExecutivesActivities = async () => {
  try {
    const response = await apiService.get("/executive-activities");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all executive activities:", error);
    throw error;
  }
};

// ✅ Fetch activity data for a single executive
export const fetchExecutiveActivity = async (executiveId) => {
  try {
    const response = await apiService.get(
      `/executive-activities/${executiveId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error fetching activity data for executive ${executiveId}:`,
      error
    );
    throw error;
  }
};

// ✅ Fetch lead section visits for a single executive
export const fetchLeadSectionVisits = async (executiveId) => {
  try {
    const response = await apiService.get(
      `/executive-activities/${executiveId}`
    );
    return response.data.leadSectionVisits;
  } catch (error) {
    console.error(
      `❌ Error fetching lead section visits for executive ${executiveId}:`,
      error
    );
    throw error;
  }
};
// ✅ Fetch fresh leads count for the executive
export const fetchFreshLeadsCount = async () => {
  try {
    const response = await apiService.get("/executive-dashboard");
    return response.data.data.freshLeads;
  } catch (error) {
    console.error("❌ Error fetching fresh leads count:", error);
    throw error;
  }
};

// ✅ Fetch follow-up count for the executive
export const fetchFollowUpCount = async () => {
  try {
    const response = await apiService.get("/executive-dashboard/followupstats");
    return response.data.data.followUps;
  } catch (error) {
    console.error("❌ Error fetching follow-up count:", error);
    throw error;
  }
};

// ✅ Fetch converted clients count for the executive
export const fetchConvertedClientsCount = async () => {
  try {
    const response = await apiService.get("/executive-dashboard/converted");
    return response.data.data.convertedClients;
  } catch (error) {
    console.error("❌ Error fetching converted clients count:", error);
    throw error;
  }
};
// ✅ Create a new lead
export const createLeadAPI = async (leadData) => {
  try {
    const response = await apiService.post("/leads", leadData); // Ensure the correct endpoint '/leads'
    return response.data; // Return the actual created lead data, which is inside response.data
  } catch (error) {
    console.error(
      "❌ Error creating lead:",
      error.response?.data || error.message
    ); // Better error logging
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// ✅ Function to fetch fresh leads for the executive
export const fetchFreshLeads = async () => {
  try {
    const response = await apiService.get("/freshleads"); // Calling the fresh leads endpoint
    return response.data; // Return the fresh leads data
  } catch (error) {
    console.error("❌ Error fetching fresh leads:", error);
    throw error; // Re-throw the error so that the calling function can handle it
  }
};

// ✅ Create a new fresh lead
export const createFreshLead = async (leadData) => {
  try {
    const response = await apiService.post("/freshleads", leadData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating fresh lead:",
      error.response?.data || error.message
    ); // ⬅️ even better error log
    throw error;
  }
};
// ✅ Create a follow-up
export const createFollowUp = async (followUpData) => {
  try {
    const response = await apiService.post("/followup/create", followUpData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating follow-up:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// ✅ Get all follow-ups
export const fetchAllFollowUps = async () => {
  try {
    const response = await apiService.get("/followup/");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching follow-ups:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// ✅ Update a follow-up inside a fresh lead
export const updateFreshLeadFollowUp = async (followUpId, updatedData) => {
  try {
    const response = await apiService.put(
      `/freshleads/update-followup/${followUpId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error updating follow-up ID ${followUpId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
// ✅ Update a follow-up by ID
export const updateFollowUp = async (followUpId, updatedData) => {
  try {
    const response = await apiService.put(
      `/followup/${followUpId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error updating follow-up ID ${followUpId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createFollowUpHistory = async (historyData) => {
  try {
    const response = await apiService.post(
      "/followuphistory/create",
      historyData
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating follow-up history:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Fetch all follow-up histories for an executive
export const fetchFollowUpHistories = async () => {
  try {
    const response = await apiService.get("/followuphistory/");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching follow-up histories:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Fetch user settings (GET)
export const fetchUserSettings = async () => {
  try {
    const response = await apiService.get("/settings"); // GET request to fetch settings
    return response.data; // Return the settings data from the response
  } catch (error) {
    console.error("❌ Error fetching user settings:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// ✅ Update user settings (PUT)
export const updateUserSettings = async (updatedSettings) => {
  try {
    const response = await apiService.put("/settings", updatedSettings); // PUT request to update settings
    return response.data; // Return the updated settings data
  } catch (error) {
    console.error("❌ Error updating user settings:", error);
    throw error; // Re-throw the error so that the calling function can handle it
  }
};

export default apiService;
