// Revised api/executiveActivity.js - focusing on secure timestamp recording

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Configure headers for API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

/**
 * Record when executive starts work (login)
 * @returns {Promise} API response
 */
export const recordStartWork = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log("📦 Payload for start work:", { executiveId: currentUser.id, executiveName: currentUser.username });

    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/startWork`,
      {
        executiveId: currentUser.id,
        executiveName: currentUser.username
      },
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/stopWork`,
      {
        executiveId: currentUser.id,
        executiveName: currentUser.username
        // No client-side timestamp - server will use its own time
      },
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/startBreak`,
      {
        executiveId: currentUser.id,
        executiveName: currentUser.username
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/stopBreak`,
      {
        executiveId: currentUser.id,
        executiveName: currentUser.username
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/updateCallTime`,
      {
        executiveId: currentUser.id,
        executiveName: currentUser.username,
        leadId: leadId,
        action: 'start'
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const response = await axios.post(
      `${API_BASE_URL}/api/executive-activities/updateCallTime`,
      {
        executiveId: currentUser.id,
        executiveName: currentUser.username,
        leadId: leadId,
        action: 'end'
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const response = await axios.get(
      `${API_BASE_URL}/api/executive-activities/status/${currentUser.id}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting activity status:', error);
    throw new Error(error.response?.data?.message || 'Failed to get activity status');
  }
};
