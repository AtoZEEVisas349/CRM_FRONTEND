// --- processService.js (Updated with PUT API) ---
import axios from 'axios';

const API_BASE_URL = "https://crm-backend-production-c208.up.railway.app/api";
const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-company-id": "ac907b89-6a1e-4438-8032-b8ae8c45382a",
};

export const createCustomerStages = async (stageData) => {
  const res = await fetch(`${API_BASE_URL}/customer-stages/stages`, {
    method: "POST",
    headers: BASE_HEADERS,
    credentials: "include",
    body: JSON.stringify(stageData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create customer stages");
  }
  return data;
};

export const getCustomerStages = async () => {
  const res = await fetch(`${API_BASE_URL}/customer-stages/stages`, {
    method: "GET",
    headers: BASE_HEADERS,
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch customer stages");
  }
  return data;
};

export const updateCustomerStages = async (stageData) => {
  const res = await fetch(`${API_BASE_URL}/customer-stages/stages`, {
    method: "PUT",
    headers: BASE_HEADERS,
    credentials: "include",
    body: JSON.stringify(stageData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update customer stages");
  }
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
