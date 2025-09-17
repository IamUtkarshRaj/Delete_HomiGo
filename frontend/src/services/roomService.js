import api from './api';

const roomService = {
  // Get all available rooms
  getRooms: async (filters = {}) => {
    try {
      const response = await api.get('/rooms', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get room details
  getRoomDetails: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new room listing
  createRoom: async (roomData) => {
    try {
      const formData = new FormData();
      
      // Append room data
      Object.keys(roomData).forEach(key => {
        if (key === 'images') {
          roomData[key].forEach(image => {
            formData.append('images', image);
          });
        } else if (typeof roomData[key] === 'object') {
          formData.append(key, JSON.stringify(roomData[key]));
        } else {
          formData.append(key, roomData[key]);
        }
      });

      const response = await api.post('/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update room listing
  updateRoom: async (roomId, roomData) => {
    try {
      const formData = new FormData();
      
      // Append room data
      Object.keys(roomData).forEach(key => {
        if (key === 'images' && Array.isArray(roomData[key])) {
          roomData[key].forEach(image => {
            formData.append('images', image);
          });
        } else if (typeof roomData[key] === 'object') {
          formData.append(key, JSON.stringify(roomData[key]));
        } else {
          formData.append(key, roomData[key]);
        }
      });

      const response = await api.put(`/rooms/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete room listing
  deleteRoom: async (roomId) => {
    try {
      const response = await axios.delete(`${API_URL}/${roomId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's room listings
  getUserRooms: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-rooms`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Contact room owner
  contactRoomOwner: async (roomId, message) => {
    try {
      const response = await axios.post(`${API_URL}/${roomId}/contact`, 
        { message }, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search rooms with filters
  searchRooms: async (searchParams) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        ...getAuthHeaders(),
        params: searchParams
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default roomService;
