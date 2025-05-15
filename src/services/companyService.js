import axios from "axios";

// Create an Axios instance specific to company service
const companyApi = axios.create({
  baseURL: "https://crm-backend-production-c208.up.railway.app/api", // ⚠️ Replace with env var in production
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach Authorization token (masterToken) automatically to all requests
companyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("masterToken"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Create a new company
 */
export const createCompany = async (data) => {
  try {
    const response = await companyApi.post("/company/create-company", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Company creation failed" };
  }
};

/**
 * Get all companies for master user
 */
export const getCompaniesForMaster = async () => {
  try {
    const response = await companyApi.get("/company/master/companies");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch companies" };
  }
};
