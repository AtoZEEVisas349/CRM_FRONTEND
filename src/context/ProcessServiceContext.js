import React, { createContext, useContext, useState,useEffect } from "react";
import {
  createCustomerStages,
  getCustomerStages,
  updateCustomerStages,
  profileSettings,
  getprofileSettings,
  updateProfileSettings
} from "../services/processService";

const ProcessServiceContext = createContext();

export const ProcessServiceProvider = ({ children }) => {
  const [stages, setStages] = useState(null);
  const [stageLoading, setStageLoading] = useState(false);
  const [stageError, setStageError] = useState(null);

  /* --------- Create --------- */
  const handleCreateStages = async (data) => {
    setStageLoading(true);
    setStageError(null);
    try {
      const response = await createCustomerStages(data);
      setStages(response.data);
      return response;
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };

  /* --------- Update --------- */
  const handleUpdateStages = async (data) => {
    setStageLoading(true);
    setStageError(null);
    try {
      const response = await updateCustomerStages(data);
      setStages(response.data || data);
      return response;
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };

  /* --------- Get --------- */
  const handleGetStages = async () => {
    setStageLoading(true);
    setStageError(null);
    try {
      const result = await getCustomerStages();
      setStages(result);
      return result;
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };

  /* --------- Upsert --------- */
  const handleUpsertStages = async (data) => {
    setStageLoading(true);
    setStageError(null);
    try {
      try {
        const response = await createCustomerStages(data); // Try POST
        setStages(response.data);
        return response;
      } catch (err) {
        if (err.message.includes("already exist")) {
          const response = await updateCustomerStages(data); // Fallback to PUT
          setStages(response.data);
          return response;
        } else {
          throw err;
        }
      }
    } catch (err) {
      setStageError(err.message);
      throw err;
    } finally {
      setStageLoading(false);
    }
  };


  const [loading, setLoading] = useState(false);  // Loading state
const [profiles, setProfile] = useState();
  const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
  // Optional: Load user from localStorage or cookie on refresh

  useEffect(() => {
    getprofile();
    console.log(profiles)
  }, []);

   const profile = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await profileSettings(data);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

const getprofile = async () => {
    setLoading(true);
    setError(null); // ✅ Reset any previous error
  
    try {
      const res = await getprofileSettings();
      setProfile(res);
    } catch (err) {
      setError(err?.error || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  }; 
 
  const handleProfileSettings = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const result = await updateProfileSettings(data);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProcessServiceContext.Provider
      value={{
        stages,
        stageLoading,
        stageError,
        handleCreateStages,
        handleUpdateStages,
        handleGetStages,
        handleUpsertStages, 
        profile,getprofile,
        handleProfileSettings,
        profiles,
        setProfile
      }}
    >
      {children}
    </ProcessServiceContext.Provider>
  );
};

export const useProcessService = () => useContext(ProcessServiceContext);
