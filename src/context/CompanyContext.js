import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createCompany,
  getCompaniesForMaster,
} from "../services/companyService";

// 1. Create Context
const CompanyContext = createContext();

// 2. Custom Hook
export const useCompany = () => useContext(CompanyContext);

// 3. Provider Component
export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------
  // Load all companies on mount
  // -------------------------
  useEffect(() => {
    fetchCompanies();
  }, []);

  // -------------------------
  // Fetch all companies
  // -------------------------
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getCompaniesForMaster();
      setCompanies(res.companies || []);
    } catch (err) {
      setError(err?.error || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Add a new company
  // -------------------------
  const addCompany = async (companyData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await createCompany(companyData);
      setCompanies((prev) => [...prev, res.company]);
      return res;
    } catch (err) {
      setError(err?.error || "Failed to create company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Provider Return
  // -------------------------
  return (
    <CompanyContext.Provider
      value={{
        companies,
        loading,
        error,
        fetchCompanies,
        addCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
