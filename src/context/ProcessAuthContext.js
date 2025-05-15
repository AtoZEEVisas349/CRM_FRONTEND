import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser,logoutUser } from "../services/processAuth";

const ProcessContext = createContext();

export const ProcessProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Logged in user info
  const [loading, setLoading] = useState(false);  // Loading state

  // Optional: Load user from localStorage or cookie on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
  
      // Combine user info with user type
      const userPayload = {
        ...(data.customer || data.person),
        type: data.type, // ✅ Ensure type is saved for UI checks
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
  
  return (
    <ProcessContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </ProcessContext.Provider>
  );
};

export const useProcess = () => useContext(ProcessContext);
