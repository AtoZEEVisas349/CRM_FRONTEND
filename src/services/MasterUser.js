// src/services/MasterUser.js
import axios from "axios";

// ✅ Create Axios instance specific to master user authentication
const authApi = axios.create({
  baseURL: "http://localhost:5000/api/masteruser", // Replace with env var in production
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
    const response = await authApi.post("/signup", userData);
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

    const response = await authApi.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

//logout
export const logoutMasterUser = async () => {
  
  const token = localStorage.getItem("masterToken"); // ✅ get token from localStorage
  try {
    const response = await axios.post(
      "http://localhost:5000/api/masteruser/logout",
      {},
      {
        headers: {
          'x-company-id': 2,
          Authorization: `Bearer ${token}`, // ✅ add Authorization header
        },
        withCredentials: true, // still useful for cookie-based auth
      }
    );
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error.response?.data || { error: "Logout failed" };
  }
};


