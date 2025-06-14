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
export const getAllCustomers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  const res = await fetch(`${API_BASE_URL}/customer/getAllCustomer`, {
    method: "GET",
    headers: {
      ...BASE_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch customers");
  return data.customers;
};
export const importConvertedClients = async () => {
  const res = await fetch(`${API_BASE_URL}/processperson/import-converted-customer`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to import converted clients");
  return data;
};

export const getCustomerStagesById = async (customerId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/customer-stages/customer-stages/${customerId}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    const data = await res.json(); // ✅ parse the JSON before using it

    if (!res.ok) throw new Error(data.error || "Failed to fetch customer stages");

    return data;
  } catch (error) {
    console.error("Failed to fetch customer stages by ID:", error);
    throw error;
  }
};
export const  uploadCustomerDocuments= async (formData) => {
  const token = localStorage.getItem('token');
const res = await fetch(`${API_BASE_URL}/customer/document/upload`,{
method: "POST",
headers: {
  // "Content-Type": "multipart/formData",
     "x-company-id": "0aa80c0b-0999-4d79-8980-e945b4ea700d",
       Authorization: `Bearer ${token}`,
},
credentials: "include",
body: formData,
});

const data = await res.json();
if (!res.ok) throw new Error(data.error || "Failed to create customer stages");
return data;
};

export const getCustomerDocuments = async (userType,id) => {
const res = await fetch(`${API_BASE_URL}/customer/document/${userType}/${id}`, {
method: "GET",
headers: getHeaders(),
credentials: "include",
});

const data = await res.json();
if (!res.ok) throw new Error(data.error || "Failed to fetch customer stages");
return data;
};

export const getProcessSettings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/processperson/process/settings`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 400 && data.message === "Invalid role specified") {
        throw new Error("Settings not available for this account type");
      }
      throw new Error(data.message || "Failed to fetch settings");
    }
    return data.settings;
  } catch (error) {
    throw error;
  }
};