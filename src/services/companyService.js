import axios from "axios";

// Create an Axios instance specific to company service
const companyApi = axios.create({
  baseURL: "http://localhost:5000/api/company", // ⚠️ Replace with env var in production
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
    const response = await companyApi.post("/create-company", data);
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
    const response = await companyApi.get("/master/companies");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch companies" };
  }
};
