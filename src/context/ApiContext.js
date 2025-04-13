import React, { createContext, useContext, useState, useEffect } from "react";
import * as apiService from "../services/apiService";
import * as upload from "../services/fileUpload";
import * as executiveService from "../services/executiveService"
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

//adminProfile
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(false); 
  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchAdminProfile();

      if (data && data.username && data.email && data.role) {
        const mappedData = {
          name: data.username,
          email: data.email,
          role: data.role,
        };
        setAdminProfile(mappedData);
      } else {
        console.warn("⚠️ Unexpected API response format:", data);
      }
    } catch (error) {
      console.error("🔴 Error fetching admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  //fetchleadSectionVisit
  const [visitData, setVisitData] = useState([]);
  const [visitLoading, setVisitLoading] = useState(false);

  const fetchLeadSectionVisitsAPI = async (executiveId) => {
    if (!executiveId) return;
    try {
      setVisitLoading(true);
      const data = await apiService.fetchLeadSectionVisits(executiveId);
      setVisitData(data.leadSectionVisits || []);
    } catch (error) {
      console.error("❌ Error fetching visits:", error);
    } finally {
      setVisitLoading(false);
    }
  };

  //fileupload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const uploadFileAPI = async (file) => {
    if (!file) {
      setUploadError("Please select a file first!");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const response = await upload.uploadFile(file);
      setUploadSuccess("File uploaded successfully!");
      return response;
    } catch (error) {
      setUploadError(error.message || "File upload failed!");
      throw error;
    } finally {
      setUploading(false);
    }
  };

//fetchAllExecutivesActivities
  const [topExecutive, setTopExecutive] = useState(null);

  const fetchExecutives = async () => {
    try {
      const executives = await apiService.fetchAllExecutivesActivities();
      if (executives.length > 0) {
        setTopExecutive(executives[0]);
      }
    } catch (error) {
      console.error("Error fetching executives:", error);
    }
  };

  //getExecutiveActivity
  const [activityData, setActivityData] = useState({
    breakTime: 0,
    workTime: 0,
    callTime: 0,
  });
  
  const getExecutiveActivity = async (executiveId) => {
    if (!executiveId) return;
  
    try {
      const data = await apiService.fetchExecutiveActivity(executiveId);
      setActivityData({
        breakTime: data.breakTime || 0,
        workTime: data.workTime || 0,
        callTime: data.callTime || 0,
      });
    } catch (error) {
      console.error("Error fetching executive activity data:", error);
    }
  };

  useEffect(() => {
    fetchExecutiveData();
    fetchUserData(); // ✅ Fetch user data on mount
    fetchOnlineExecutivesData();
    fetchAdmin();
    fetchLeadSectionVisitsAPI();
    uploadFileAPI();
    fetchExecutives();
    getExecutiveActivity();
  }, []);

  const apiFunctions = {
    // Leads
    fetchLeadsAPI: apiService.fetchLeadsAPI,
    fetchAssignedLeads: apiService.fetchAssignedLeads,
    assignLeadAPI: apiService.assignLeadAPI,

    // Executives
    fetchExecutivesAPI: apiService.fetchExecutivesAPI,
    fetchExecutiveInfo: apiService.fetchExecutiveInfo,


    // Executive Activity
    // fetchAllExecutivesActivities: apiService.fetchAllExecutivesActivities,
    // fetchExecutiveActivity: apiService.fetchExecutiveActivity,
    // fetchLeadSectionVisits: apiService.fetchLeadSectionVisits,
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
         //
         adminProfile,
         loading,
         fetchAdmin,
         //
         visitData, fetchLeadSectionVisitsAPI, visitLoading,
         //fileupload
         uploadFileAPI, uploading, uploadError, uploadSuccess,
         //
         topExecutive, fetchExecutives ,
         //
         activityData,
         getExecutiveActivity,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
