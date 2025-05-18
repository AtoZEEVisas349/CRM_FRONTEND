import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createCustomerStages,
  getCustomerStages,
  updateCustomerStages,
  profileSettings,
  getprofileSettings,
  updateProfileSettings,
} from "../services/processService";

// 1. Create Context
const ProcessServiceContext = createContext();

// 2. Provider Component
export const ProcessServiceProvider = ({ children }) => {
  // -----------------------
  // Stage Management State
  // -----------------------
  const [stages, setStages] = useState(null);
  const [stageLoading, setStageLoading] = useState(false);
  const [stageError, setStageError] = useState(null);

  // -----------------------
  // Profile Settings State
  // -----------------------
  const [profiles, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // -----------------------
  // Effects
  // -----------------------
  useEffect(() => {
    getProfile();
    console.log(profiles);
  }, []);

  // -----------------------
  // Stage API Handlers
  // -----------------------
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

  // -----------------------
  // Profile Settings Handlers
  // -----------------------
  const profile = async (data) => {
    setLoading(true);
    setError(null);
    try {
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

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getprofileSettings();
      setProfile(res);
    } catch (err) {
      setError(err?.error || "Failed to fetch profile settings");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSettings = async (data) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
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

  // -----------------------
  // Provider Return
  // -----------------------
  return (
    <ProcessServiceContext.Provider
      value={{
        // Stages
        stages,
        stageLoading,
        stageError,
        handleCreateStages,
        handleUpdateStages,
        handleGetStages,
        handleUpsertStages,

        // Profiles
        profile,
        getProfile,
        handleProfileSettings,
        profiles,
        setProfile,
      }}
    >
      {children}
    </ProcessServiceContext.Provider>
  );
};

// 3. Custom Hook
export const useProcessService = () => useContext(ProcessServiceContext);
