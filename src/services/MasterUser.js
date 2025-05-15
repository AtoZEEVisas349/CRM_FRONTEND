// src/services/MasterUser.js
import axios from "axios";

// ✅ Create Axios instance specific to master user authentication
const authApi = axios.create({
  baseURL: "https://crm-backend-production-c208.up.railway.app/api", // Replace with env var in production
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ⬅️ Required if backend sets httpOnly cookies
});

/**
 * Master User Signup
 * @param {Object} userData - { email, password }
 */
export const signupMasterUser = async (userData) => {
  try {
    const response = await authApi.post("/masteruser/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Signup failed" };
  }
};

/**
 * Master User Login
 * @param {Object} credentials - { email, password }
 */
export const loginMasterUser = async (credentials) => {
  try {
    localStorage.removeItem("masterToken");

    const response = await authApi.post("/masteruser/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

//logout
export const logoutMasterUser = async () => {
  const token = localStorage.getItem("masterToken");

  try {
    const response = await authApi.post(
      "/masteruser/logout",
      {},
      {
        headers: {
          'x-company-id': "8156c301-ac2c-40f5-8bf8-ea21b05a60c6",
          Authorization: `Bearer ${token}`, // ✅ Securely attached token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error.response?.data || { error: "Logout failed" };
  }
};



