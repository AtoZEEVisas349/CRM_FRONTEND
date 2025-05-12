import React, { createContext, useContext, useEffect, useState } from "react";
import { loginMasterUser, signupMasterUser,logoutMasterUser } from "../services/MasterUser";
import { Navigate, useNavigate } from "react-router-dom";

// Create Context
const MasterContext = createContext();

// Custom hook
export const useMaster = () => useContext(MasterContext);

// Provider
export const MasterProvider = ({ children }) => {
  const [masterUser, setMasterUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load session from storage
  useEffect(() => {
    const storedUser = localStorage.getItem("masterUser");
    const token = localStorage.getItem("masterToken");

    if (storedUser && token) {
      setMasterUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
const login = async (credentials) => {
  const response = await loginMasterUser(credentials);
  const { user, token } = response;

  if (user) {
    localStorage.setItem("masterUser", JSON.stringify(user));
    setMasterUser(user);
  }

  if (token && typeof token === "string" && token.split(".").length === 3) {
    localStorage.setItem("masterToken", token);
  } else {
    console.warn("⚠️ Skipping storage of malformed token:", token);
  }

  return response;
};


  // Signup
  const signup = async (userData) => {
    const response = await signupMasterUser(userData);
    const { user } = response;

    localStorage.setItem("masterUser", JSON.stringify(user));
    setMasterUser(user);
    return response;
  };

  // Logout
  const logout = async () => {
    try {
      await logoutMasterUser(); // Backend will clear cookie
  
      // Clear local storage (client-side)
      localStorage.removeItem("masterUser");
      localStorage.removeItem("masterToken");
  
      setMasterUser(null);
      navigate("/master-login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      alert("Something went wrong during logout.");
    }
  };
  

  return (
    <MasterContext.Provider
      value={{
        masterUser,
        loading,
        isAuthenticated: !!masterUser,
        login,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </MasterContext.Provider>
  );
};

// Route guard for master-only routes
export const PrivateMasterRoute = ({ children }) => {
  const { isAuthenticated } = useMaster();
  return isAuthenticated ? children : <Navigate to="/master/loginmaster" replace />;
};
