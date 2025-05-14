import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../services/processAuth";

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
      setUser(data.customer || data.person);
  
      // ✅ Save token so PrivateRoute works
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
  
      localStorage.setItem("user", JSON.stringify(data.customer || data.person));
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

  const logout = () => {
    // Optional: add backend logout endpoint if needed
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <ProcessContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </ProcessContext.Provider>
  );
};

export const useProcess = () => useContext(ProcessContext);
