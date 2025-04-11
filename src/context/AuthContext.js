import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import { useNavigate } from "react-router-dom";

// 1. Create Context
const AuthContext = createContext();

// 2. Create Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login function
// Your context file (probably: src/context/AuthContext.js or similar)

const login = async (email, password) => {
    try {
      const response = await authService.loginUser(email, password);
      const user = response.user;
      
      // Save executiveId in localStorage (Make sure this is set properly)
      localStorage.setItem("executiveId", user.executiveId);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", response.token);
  
      setUser(user);
    } catch (error) {
      throw error;
    }
  };
  
  

  // Logout function
  const logout = async () => {
    try {
      await authService.logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("executiveId");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  
  
  
  // Forgot Password
  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email);
  };

  // Reset Password
  const resetPassword = async (token, newPassword) => {
    return await authService.resetPassword(token, newPassword);
  };

  // Signup
  const signup = async (username, email, password, role) => {
    return await authService.signupUser(username, email, password, role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        forgotPassword,
        resetPassword,
        signup,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook for consuming context
export const useAuth = () => useContext(AuthContext);
