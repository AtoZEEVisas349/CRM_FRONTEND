// --- processService.js (Updated with PUT API) ---
import axios from 'axios';

const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";
const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-company-id": "0aa80c0b-0999-4d79-8980-e945b4ea700d",
};


// ✅ Dynamic headers with token
const getHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found in localStorage");

  return {
    "Content-Type": "application/json",
    "x-company-id": "0aa80c0b-0999-4d79-8980-e945b4ea700d",
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
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { error: 'Token missing in localStorage' };
    }

    const { phone, dob, nationality, passportNumber } = payload;

    const response = await axios.post(
      `${API_BASE_URL}/customer-details`,
      { phone, dob, nationality, passportNumber },
      {
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('API call error:', error.response || error);
    throw error.response?.data || { error: 'Network error or server error' };
  }
};


export const getprofileSettings = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/customer-details`, {
    method: "GET",
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const responseBody = await res.json();

  if (!res.ok) {
    console.error("Details fetching failed:", responseBody);
    throw new Error(responseBody.error || "Details fetching failed");
  }

  return responseBody;
};

export const updateProfileSettings = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const { phone, dob, nationality, passportNumber } = payload;

    const response = await axios.put(
      `${API_BASE_URL}/customer-details`,
      { phone, dob, nationality, passportNumber },
      {
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};
// ✅ GET - All Converted Clients
export const getAllConvertedClients = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  const res = await fetch(`${API_BASE_URL}/converted`, {
    method: "GET",
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch converted clients");
  }

  return data;
};
