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
export const fetchAssignedLeads = async () => {
  try {
    const executiveName = localStorage.getItem("executiveName");

    if (!executiveName) {
      console.error("🚨 Executive name missing in localStorage!");
      throw new Error("Executive name not found in localStorage!");
    }

    const response = await apiService.get(`/client-leads/executive?executiveName=${executiveName}`);
    return response.data.leads;
  } catch (error) {
    console.error("❌ Error fetching assigned leads:", error);
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
    const response = await apiService.get('/admin/profile');
    return response.data;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};

// ✅ Function to assign leads to an executive
export const assignLeadAPI = async (leadId, executiveId, executiveName) => {
  try {
    const response = await apiService.put(`/client-leads/assign-executive/${leadId}`, {
      executiveId,
      executiveName,
    });
    console.log(`✅ Lead ${leadId} assigned successfully:`, response.data);
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
    const response = await apiService.get(`/executive-activities/${executiveId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching activity data for executive ${executiveId}:`, error);
    throw error;
  }
};

// ✅ Fetch lead section visits for a single executive
export const fetchLeadSectionVisits = async (executiveId) => {
  try {
    const response = await apiService.get(`/executive-activities/${executiveId}`);
    return response.data.leadSectionVisits;
  } catch (error) {
    console.error(`❌ Error fetching lead section visits for executive ${executiveId}:`, error);
    throw error;
  }
};

export default apiService;
