// --- processService.js (Updated with PUT API) ---
import axios from 'axios';

const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";
const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-company-id": "549403a0-8e59-440f-a381-17ae457c60c4",
};


// ✅ Dynamic headers with token
const getHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found in localStorage");

  return {
    "Content-Type": "application/json",
    "x-company-id": "549403a0-8e59-440f-a381-17ae457c60c4",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ POST - Create
export const createCustomerStages = async (stageData) => {
  const res = await fetch(`${API_BASE_URL}/customer-stages/stages`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(stageData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create customer stages");
  return data;
};

// ✅ GET - Fetch
export const getCustomerStages = async () => {
  const res = await fetch(`${API_BASE_URL}/customer-stages/stages`, {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch customer stages");
  return data;
};

// ✅ PUT - Update
export const updateCustomerStages = async (stageData) => {
  const res = await fetch(`${API_BASE_URL}/customer-stages/stages`, {
    method: "PUT",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(stageData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update customer stages");
  return data;
};
/*---------------------Customer settings-----------------*/
export const profileSettings = async (payload) => {
  const headers = getHeaders();
  const response = await axios.post(`${API_BASE_URL}/customer-details`, payload, { headers });
  return response.data;
};

export const getprofileSettings = async () => {
  const headers = getHeaders();
  const response = await axios.get(`${API_BASE_URL}/customer-details`, { headers });
  return response.data;
};

export const updateProfileSettings = async (payload) => {
  const headers = getHeaders();
  const response = await axios.put(`${API_BASE_URL}/customer-details`, payload, { headers });
  return response.data;
};
