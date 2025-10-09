import axios from 'axios';

const API_URL = 'http://localhost:5000/api/matches';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const matchService = {
  // Get potential matches
  getMatches: async () => {
    try {
      const response = await axios.get(`${API_URL}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match details
  getMatchDetails: async (matchId) => {
    try {
      const response = await axios.get(`${API_URL}/${matchId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like a match
  likeMatch: async (matchId) => {
    try {
      const response = await axios.post(`${API_URL}/${matchId}/like`, {}, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Pass on a match
  passMatch: async (matchId) => {
    try {
      const response = await axios.post(`${API_URL}/${matchId}/pass`, {}, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get mutual matches
  getMutualMatches: async () => {
    try {
      const response = await axios.get(`${API_URL}/mutual`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate compatibility score
  calculateCompatibility: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/compatibility/${userId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default matchService;
