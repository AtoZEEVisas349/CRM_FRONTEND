// Revised api/executiveActivity.js - focusing on secure timestamp recording
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Configure headers for API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Record when executive starts work (login)
 * @returns {Promise} API response
 */
export const recordStartWork = async () => {
  try {
    // Step 1: Parse the user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || '{}');
    const ExecutiveId = userData?.id;
    const executiveName = userData?.username;
    console.log({ExecutiveId, executiveName});

    const payload = {
      ExecutiveId,
      executiveName
    };

    console.log("📦 Payload for start work:", payload);

    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/startWork`, // Corrected here
      payload,
      { headers: getHeaders() }
    );

    console.log("✅ API Response for start work:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error recording start work:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to record work start');
  }
};

/**
 * Record when executive stops work (logout)
 * @returns {Promise} API response
 */
export const recordStopWork = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || '{}');
    const ExecutiveId = userData?.id;
    const executiveName = userData?.username;
    console.log({ExecutiveId, executiveName});

    const payload = {
      ExecutiveId,
      executiveName
    };

    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/stopWork`, // Corrected here
      payload,
      { headers: getHeaders() }
    );

    return response.data;
  } catch (error) {
    console.error('Error recording stop work:', error);
    throw new Error(error.response?.data?.message || 'Failed to record work stop');
  }
};

/**
 * Record when executive starts a break
 * @returns {Promise} API response
 */
export const recordStartBreak = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || '{}');
    const ExecutiveId = userData?.id;
    const executiveName = userData?.username;

    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/startBreak`, // Corrected here
      {
        ExecutiveId,
        executiveName
        // No client-side timestamp - server will use its own time
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error recording break start:', error);
    throw new Error(error.response?.data?.message || 'Failed to record break start');
  }
};

/**
 * Record when executive stops a break
 * @returns {Promise} API response
 */
export const recordStopBreak = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || '{}');
    const ExecutiveId = userData?.id;
    const executiveName = userData?.username;

    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/stopBreak`, // Corrected here
      {
        ExecutiveId,
        executiveName
        // No client-side timestamp - server will use its own time
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error recording break stop:', error);
    throw new Error(error.response?.data?.message || 'Failed to record break stop');
  }
};

/**
 * Update call time for an executive
 * @param {string} leadId - ID of the lead that was called
 * @returns {Promise} API response
 */
export const startCall = async (leadId) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/updateCallTime`, // Corrected here
      {
        ExecutiveId: currentUser.id,
        executiveName: currentUser.username,
        leadId: leadId,
        action: 'start',
        callDuration: 1,
        // Server will record the timestamp
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error starting call:', error);
    throw new Error(error.response?.data?.message || 'Failed to start call');
  }
};

/**
 * End call tracking for an executive
 * @param {string} leadId - ID of the lead that was called
 * @returns {Promise} API response
 */
export const endCall = async (leadId) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/updateCallTime`, // Corrected here
      {
        ExecutiveId: currentUser.id,
        executiveName: currentUser.username,
        leadId: leadId,
        action: 'end',
        callDuration: 1
        // Server will calculate duration
      },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error ending call:', error);
    throw new Error(error.response?.data?.message || 'Failed to end call');
  }
};

export const getActivityStatus = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || '{}');
   
    const response = await axios.get(
      `${API_BASE_URL}/api/executive-activities/status/${userData.id}`, // Corrected here
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting activity status:', error);
    throw new Error(error.response?.data?.message || 'Failed to get activity status');
  }
};

export const leadtrackVisit = async (executiveId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/trackLeadVisit`, // Corrected here
      { ExecutiveId: executiveId },          // Body data
      { headers: getHeaders() }               // Headers
    );

    console.log('Lead visit tracked:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('API error:', error.response.data.message);
    } else {
      console.error('Network error:', error.message);
    }
  }
};
