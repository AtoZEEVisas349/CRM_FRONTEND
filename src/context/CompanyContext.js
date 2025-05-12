import React, { createContext, useContext, useEffect, useState } from "react";
import { createCompany, getCompaniesForMaster } from "../services/companyService";

// 1. Create Context
const CompanyContext = createContext();

// 2. Custom Hook
export const useCompany = () => useContext(CompanyContext);

// 3. Provider
export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all companies on load (optional — or call manually when needed)
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await getCompaniesForMaster();
      setCompanies(res.companies || []);
    } catch (err) {
      setError(err.error || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Create company
  const addCompany = async (companyData) => {
    try {
      setLoading(true);
      const res = await createCompany(companyData);
      setCompanies((prev) => [...prev, res.company]);
      return res;
    } catch (err) {
      setError(err.error || "Failed to create company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
