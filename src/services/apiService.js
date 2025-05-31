import axios from "axios";
const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

// ✅ Automatically attach token to requests (if available)
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ONLY executive/admin token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Remove malformed header
    }    
    // 🔥 Add x-company-id (hardcoded or from localStorage)
    config.headers["x-company-id"] = "0aa80c0b-0999-4d79-8980-e945b4ea700d"; // Hardcoded
    // Or use:
    // config.headers["x-company-id"] = localStorage.getItem("Company-Id") || "1";

    return config;
  },
  (error) => Promise.reject(error)
);

export const updateUserLoginStatus = async (userId, canLogin) => {
  try {
    const response = await apiService.put("/login-status", { userId, canLogin });
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating login status for user ${userId}:`, error);
    throw error;
  }
};
// ✅ Function to fetch all leads
export const fetchLeadsAPI = async (limit = 10, offset = 0) => {
  try {
    const response = await apiService.get(`/client-leads/getClients?limit=${limit}&offset=${offset}`);
    return response.data; // Return the full response (including leads and pagination metadata)
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
export const fetchNotificationsByUser = async ({ userId, userRole }) => {
  try {
    const response = await apiService.post(`/notification/user`, {
      userId,
      userRole,
    });
    return response.data.notifications;
  } catch (error) {
    console.error(`❌ Error fetching notifications for user ${userId}:`, error);
    throw error;
  }
};
export const createCopyNotification = async ({ userId, userRole, message }) => {
  try {
    const response = await apiService.post("/notification/copy-event", {
      userId,
      message,
      userRole,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating copy notification:", error);
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
export const assignLeadAPI = async (leadId, executiveName) => {
  try {
    const response = await apiService.put(
      `/client-leads/assign-executive`,
      {
        id: Number(leadId),       // ✅ Explicitly cast to integer
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

// ✅ Create a new lead
export const createLeadAPI = async (leadData) => {
  try {
    const response = await apiService.post("/leads", leadData); 
    return response.data; 
  } catch (error) {
    console.error(
      "❌ Error creating lead:",
      error.response?.data || error.message
    ); 
    throw error; 
  }
};

// ✅ Function to fetch fresh leads for the executive
export const fetchFreshLeads = async () => {
  try {
    const response = await apiService.get("/freshleads"); 
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching fresh leads:", error);
    throw error; 
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
    ); 
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
    const response = await apiService.get("/settings"); 
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching user settings:", error);
    throw error; 
  }
};

// ✅ Update user settings (PUT)
export const updateUserSettings = async (updatedSettings) => {
  try {
    const response = await apiService.put("/settings", updatedSettings); 
    return response.data; 
  } catch (error) {
    console.error("❌ Error updating user settings:", error);
    throw error; 
  }
};
export const fetchMeetings = async () => {
  try {
    const response = await apiService.get("/meetings/exec");
    return response.data.data; 
  } catch (error) {
    console.error("❌ Error fetching meetings:", error.response?.data || error.message);
    throw error;
  }
};

export const createMeetingAPI = (meetingData) =>
  apiService.post("/meetings", meetingData).then(res => res.data);

// ✅ Create a new converted client (using fresh_lead_id)
export const createConvertedClient = async (convertedData) => {
  try {
    const response = await apiService.post("/converted", convertedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating converted client:", error.response?.data || error.message);
    throw error;
  }
};
//fetch Converted clients

// Fetch converted clients dynamically based on executiveId or username
export const fetchConvertedClients = async (executiveId = null) => {
  try {
    const endpoint = executiveId ? '/converted/exec' : '/converted';
    const response = await apiService.get(endpoint, {
      headers: executiveId ? { 'x-executive-id': executiveId } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching converted clients:", error.response?.data || error.message);
    throw error;
  }
};
// ✅ Function to create a Close Lead (POST)
export const createCloseLead = async (closeLeadData) => {
  try {
    const response = await apiService.post("/close-leads/", {
      ...closeLeadData,
      clientLead: closeLeadData.clientLead, 
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating close lead:", error.response?.data || error.message);
    throw error;
  }
};

// Function to fetch all close leads
export const fetchAllCloseLeads = async () => {
  try {
    const response = await apiService.get("/close-leads/"); // 👉 No params
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all close leads:", error.response?.data || error.message);
    throw error;
  }
};

export const adminMeeting = async () => {
  try {
    const response = await apiService.get("/meetings");
    if (response && response.data && response.data.meetings) {
      return response.data.meetings;  // Ensure we are returning meetings data
    } else {
      console.error("Error: Meetings data is not available in the correct format:", response.data);
      return [];  // Return an empty array if data is not valid
    }
  } catch (error) {
    console.error("❌ Error fetching admin meetings:", error.response?.data || error.message);
    throw error;  // Ensure errors are thrown to handle them in the component
  }
};

// ✅ Fetch executive activity summary for admin dashboard
export const fetchAdminExecutiveDashboard = async () => {
  try {
    const response = await apiService.get("/executive-activities/adminDashboard");
    return response.data.executives; // returns array of executives with activity data
  } catch (error) {
    console.error("❌ Error fetching admin executive dashboard data:", error);
    throw error;
  }
};
// ✅ Fetch revenue chart data
export const fetchRevenueChartData = async () => {
  try {
    const response = await apiService.get("/revenue/revenue-data");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching revenue chart data:", error);
    throw error;
  }
};
export const fetchDealFunnelData = async () => {
  try {
    const response = await apiService.get("/client-leads/dealfunnel");
    return response.data.data; // Returns { statusCounts, totalLeads }
  } catch (error) {
    console.error("❌ Error fetching deal funnel data:", error);
    throw error;
  }
};
//Reassigned Leads 
export const reassignLead = async (leadId, newExecutive) => {
  try {
    const response = await apiService.put(`leads/reassign`, {
      leadId: Number(leadId),
      newExecutive,
    });
    return response.data;
  } catch (error) {
    console.error("Error in reassignLead API:", error);
    throw error;
  }
};
// Function to fetch all opportunities
export const fetchOpportunities = async () => {
  try {
    const response = await apiService.get("/opportunities");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching opportunities:", error);
    throw error;
  }
};
export const verifyNumber = async (number) => {
  try {
    const cleanedNumber = number.replace(/\D/g, "");
    const response = await apiService.get(`/get-name?number=${cleanedNumber}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error verifying number:", error);
    throw error;
  }
};
// ✅ Update a meeting by ID
export const updateMeeting = async (meetingId, updatedData) => {
  try {
    const response = await apiService.put(
      `/meetings/${meetingId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error updating meeting ID ${meetingId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
// New function to update ClientLead status
export const updateClientLeadStatus = async (leadId, status) => {
  try {
    const response = await apiService.put("/freshleads/update-clientlead", {
      leadId,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating ClientLead status:", error);
    throw error;
  }
};
//EOD Report
export const sendEodReport = async ({ email, content }) => {
  try {
    const response = await apiService.post("/report", { email, content });
    return response.data;
  } catch (error) {
    console.error("❌ Error sending EOD report:", error);
    throw error;
  }
};

export default apiService;
