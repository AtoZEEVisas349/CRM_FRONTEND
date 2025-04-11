import React, { createContext, useContext, useState, useEffect } from "react";
import * as apiService from "../services/apiService";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // ✅ Existing state
  const [executiveInfo, setExecutiveInfo] = useState(null);
  const [executiveLoading, setExecutiveLoading] = useState(false);

  // ✅ New: User state
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [userLoading, setUserLoading] = useState(false);
 
  // ✅ Online Executives state
 const [onlineExecutives, setOnlineExecutives] = useState([]);
 const [onlineLoading, setOnlineLoading] = useState(false);

  // ✅ Fetch executive data (already existing)
  const fetchExecutiveData = async () => {
    setExecutiveLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const executiveId = currentUser?.id;

      if (!executiveId) {
        console.error("No executiveId found in localStorage!");
        setExecutiveLoading(false);
        return;
      }

      const response = await apiService.fetchExecutiveInfo(executiveId);

      if (response?.data?.executive) {
        setExecutiveInfo(response.data.executive);
      } else {
        console.error("Executive data missing:", response.data);
      }
    } catch (error) {
      console.error("Error fetching executive data:", error);
    } finally {
      setExecutiveLoading(false);
    }
  };

  // ✅ New: Fetch user data
  const fetchUserData = async () => {
    setUserLoading(true);
    try {
      const response = await apiService.fetchAdminProfile();
      const { name, email, role } = response.data;
      setUser({ name, email, role });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setUserLoading(false);
    }
  };

  // ✅ Fetch online executives
  const fetchOnlineExecutivesData = async () => {
    setOnlineLoading(true);
    try {
      const data = await apiService.fetchOnlineExecutives();
      setOnlineExecutives(data);
    } catch (error) {
      console.error("Error fetching online executives:", error);
    } finally {
      setOnlineLoading(false);
    }
  };
  

  useEffect(() => {
    fetchExecutiveData();
    fetchUserData(); // ✅ Fetch user data on mount
    fetchOnlineExecutivesData();
  }, []);

  const apiFunctions = {
    // Leads
    fetchLeadsAPI: apiService.fetchLeadsAPI,
    fetchAssignedLeads: apiService.fetchAssignedLeads,
    assignLeadAPI: apiService.assignLeadAPI,

    // Executives
    fetchExecutivesAPI: apiService.fetchExecutivesAPI,
    fetchExecutiveInfo: apiService.fetchExecutiveInfo,

    // Admin
    fetchAdminProfile: apiService.fetchAdminProfile,

    // Executive Activity
    fetchAllExecutivesActivities: apiService.fetchAllExecutivesActivities,
    fetchExecutiveActivity: apiService.fetchExecutiveActivity,
    fetchLeadSectionVisits: apiService.fetchLeadSectionVisits,
  };

  return (
    <ApiContext.Provider
      value={{
        // ✅ API functions
        ...apiFunctions,

        // ✅ Executive Info State
        executiveInfo,
        executiveLoading,
        fetchExecutiveData,

        // ✅ User state
        user,
        setUser,
        userLoading,
        fetchUserData,
        
        // ✅ Online Executives
         onlineExecutives,
         onlineLoading,
         fetchOnlineExecutivesData,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
