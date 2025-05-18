import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  signupUser,
  logoutUser,
} from "../services/processAuth";

// 1. Create Context
const ProcessContext = createContext();

// 2. Provider Component
export const ProcessProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Logged in user info
  const [loading, setLoading] = useState(false);  // Loading state

  // ---------------------------------------
  // Load session from localStorage on refresh
  // ---------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ---------------------------------------
  // Login Handler
  // ---------------------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);

      const userPayload = {
        ...(data.customer || data.person),
        type: data.type, // ✅ Important for type-based UI control
      };

      setUser(userPayload);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("user", JSON.stringify(userPayload));

      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Signup Handler
  // ---------------------------------------
  const signup = async (fullName, email, password, userType) => {
    setLoading(true);
    try {
      const data = await signupUser(fullName, email, password, userType);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Logout Handler
  // ---------------------------------------
  const logout = async () => {
    try {
      const userType = user?.type || "customer";
      await logoutUser(userType);
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  // ---------------------------------------
  // Provider Return
  // ---------------------------------------
  return (
    <ProcessContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </ProcessContext.Provider>
  );
};

// 3. Custom Hook
export const useProcess = () => useContext(ProcessContext);
