import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create a session ID that persists during the user's session
const getSessionId = () => {
  let sessionId = localStorage.getItem('ussd_session_id');
  if (!sessionId) {
    sessionId = `web-session-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('ussd_session_id', sessionId);
  }
  return sessionId;
};

// Main function to interact with USSD API
export const processUSSD = async (
  phoneNumber: string,
  text: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ussd`, {
      sessionId: getSessionId(),
      serviceCode: '*123#',
      phoneNumber,
      text
    });

    return response.data;
  } catch (error) {
    console.error('USSD API Error:', error);
    if (axios.isAxiosError(error) && error.response) {
      return `END Error: ${error.response.status} - ${error.response.data}`;
    }
    return 'END Connection error. Please try again.';
  }
};

// Clear session
export const clearUSSDSession = () => {
  localStorage.removeItem('ussd_session_id');
};
