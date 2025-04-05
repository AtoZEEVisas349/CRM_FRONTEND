import apiService from "./apiService";
import { Navigate } from "react-router-dom";

/*------------------------------LOGIN-----------------------*/
export const loginUser = async (email, password) => {
  try {
    const response = await apiService.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed!");
  }
};

/*------------------------------Forget Password---------------------------*/
export const forgotPassword = async (email) => {
    try {
        const response = await apiService.post("/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to send reset link!");
    }
};
/*---------------------------------RESET PASSWORD-----------------------------------*/
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await apiService.post("/reset-password", { token, newPassword });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to reset password!");
    }
};
/*---------------------------------SIGNUP--------------------------------------------*/
export const signupUser = async (username, email, password, role) => {
    try {
        const roleMapping = {
            admin: "Admin",
            executive: "Executive",
            user: "TL",
        };
        const mappedRole = roleMapping[role];

        const response = await apiService.post("/signup", {
            username,
            email,
            password,
            role: mappedRole,
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Signup failed!");
    }
};
/*---------------------------------AUTHENTICATION & PRIVATE ROUTE----------------------------------*/

// Check if user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem("token") ? true : false;
  };
  
  // Private Route Component
  export const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };