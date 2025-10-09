import api from './api';
import CompatibilityMatcher from './compatibilityService';
import authService from './authService';

const roomService = {
  // Get all available rooms with compatibility scores
  getRooms: async function(filters = {}) {
    try {
      const response = await api.get('/listings', { params: filters });
      const listings = response.data.data || response.data;
      
      // Get current user preferences for compatibility calculation
      let userPreferences = {};
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser.success) {
          userPreferences = currentUser.data;
        }
      } catch (error) {
        console.warn('Could not fetch user preferences for compatibility matching:', error);
      }

      // Calculate compatibility for each listing
      const listingsWithCompatibility = listings.map(listing => {
        const transformedListing = this.transformListingData(listing);
        const compatibility = CompatibilityMatcher.calculateCompatibility(userPreferences, transformedListing);
        return {
          ...transformedListing,
          compatibility,
          compatibilityColor: CompatibilityMatcher.getCompatibilityColor(compatibility),
          compatibilityLabel: CompatibilityMatcher.getCompatibilityLabel(compatibility)
        };
      });

      // Sort by compatibility if no specific sort order is requested
      if (!filters.sortBy || filters.sortBy === 'relevance') {
        listingsWithCompatibility.sort((a, b) => b.compatibility - a.compatibility);
      }

      return {
        success: true,
        data: listingsWithCompatibility
      };
    } catch (error) {
      console.error('Backend API error:', error);
      // Return empty array as fallback
      return {
        success: true,
        data: []
      };
    }
  },

  // Get room details with compatibility
  getRoomDetails: async function(roomId) {
    try {
      const response = await api.get(`/listings/${roomId}`);
      const listing = response.data.data || response.data;
      
      // Get current user preferences for compatibility calculation
      let userPreferences = {};
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser.success) {
          userPreferences = currentUser.data;
        }
      } catch (error) {
        console.warn('Could not fetch user preferences for compatibility matching:', error);
      }

      const transformedListing = this.transformListingData(listing);
      const compatibility = CompatibilityMatcher.calculateCompatibility(userPreferences, transformedListing);
      
      return {
        success: true,
        data: {
          ...transformedListing,
          compatibility,
          compatibilityColor: CompatibilityMatcher.getCompatibilityColor(compatibility),
          compatibilityLabel: CompatibilityMatcher.getCompatibilityLabel(compatibility)
        }
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new room listing
  createRoom: async function(roomData) {
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

      const response = await api.post('/listings', formData, {
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
  updateRoom: async function(roomId, roomData) {
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

      const response = await api.put(`/listings/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete room listing
  deleteRoom: async function(roomId) {
    try {
      const response = await api.delete(`/listings/${roomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search rooms with advanced filters and compatibility
  searchRooms: async function(searchParams) {
    try {
      const {
        searchTerm,
        priceRange,
        genderFilter,
        amenitiesFilter,
        occupancyFilter,
        ratingFilter,
        distanceFilter,
        sortBy,
        location
      } = searchParams;

      const filters = {};
      
      if (priceRange && priceRange.length === 2) {
        filters.minPrice = priceRange[0];
        filters.maxPrice = priceRange[1];
      }
      
      if (amenitiesFilter && amenitiesFilter.length > 0) {
        filters.amenities = amenitiesFilter.join(',');
      }
      
      if (genderFilter && genderFilter !== 'any') {
        filters.gender = genderFilter;
      }
      
      if (location) {
        filters.location = location;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }

      filters.sortBy = sortBy;

      const response = await this.getRooms(filters);
      let listings = response.data;

      // Apply frontend filters that aren't handled by backend
      if (occupancyFilter && occupancyFilter !== 'any') {
        listings = listings.filter(listing => {
          const occupancy = listing.occupancy || listing.roomType || '';
          return occupancy.toLowerCase().includes(occupancyFilter.toLowerCase());
        });
      }

      if (ratingFilter > 0) {
        listings = listings.filter(listing => (listing.rating || 0) >= ratingFilter);
      }

      if (distanceFilter) {
        listings = listings.filter(listing => (listing.distance || 0) <= distanceFilter);
      }

      return {
        success: true,
        data: listings
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Transform backend listing data to frontend format
  transformListingData: function(backendListing) {
    return {
      id: backendListing._id,
      name: backendListing.title,
      type: backendListing.roomType === 'shared' ? 'PG' : 
            backendListing.roomType === 'single' ? 'PG' : 
            backendListing.roomType === 'apartment' ? 'Apartment' : 'PG',
      price: backendListing.price,
      distance: backendListing.distance || parseFloat((Math.random() * 5).toFixed(2)), // Fallback for demo
      rating: backendListing.rating || parseFloat((4 + Math.random()).toFixed(2)), // Fallback for demo
      reviews: backendListing.reviews || Math.floor(Math.random() * 200 + 20),
      occupancy: backendListing.roomType === 'single' ? '1 sharing' :
                 backendListing.roomType === 'shared' ? '2 sharing' :
                 backendListing.roomType === 'apartment' ? 'Studio' : '1 sharing',
      gender: backendListing.preferences?.gender || 'Any',
      available: backendListing.availableRooms > 0,
      amenities: backendListing.amenities || [],
      image: backendListing.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      location: backendListing.address,
      description: backendListing.description,
      owner: backendListing.owner?.fullname || 'Owner',
      ownerId: backendListing.owner?._id,
      verified: backendListing.verified || Math.random() > 0.3,
      featured: backendListing.featured || Math.random() > 0.7,
      lastUpdated: new Date(backendListing.updatedAt).toLocaleDateString() || 'Today'
    };
  },

  // Get listings for a specific owner
  getOwnerListings: async function() {
    try {
      const response = await api.get('/listings/my-listings');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching owner listings:', error);
      // Return mock data as fallback for analytics calculation
      return {
        success: true,
        data: [
          {
            id: 1,
            title: 'Elite Girls PG',
            price: 15000,
            status: 'active',
            availableRooms: 3,
            totalRooms: 15,
            views: 245,
            inquiries: 12,
            rating: 4.8
          },
          {
            id: 2,
            title: 'Boys Hostel Prime',
            price: 12000,
            status: 'active',
            availableRooms: 5,
            totalRooms: 20,
            views: 189,
            inquiries: 8,
            rating: 4.5
          }
        ]
      };
    }
  }
};

export default roomService;
