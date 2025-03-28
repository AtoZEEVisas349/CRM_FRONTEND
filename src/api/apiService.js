import axios from "axios";

// Create an Axios instance with base settings
const apiService = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to requests (if available)
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

export default apiService;
