import axiosInstance from "../AxiosInstance";
import { ACCREDITATION_BASE_URL } from "../../config/adminUrlConfig";

// Utility function to handle API errors consistently
const handleApiError = (error, operation = "operation") => {
  console.error(`Error in ${operation}:`, error);
  
  if (error.response) {
    // Backend returned an error response
    const backendError = error.response.data;
    if (backendError.message) {
      return new Error(backendError.message);
    } else if (backendError.error && typeof backendError.error === 'object') {
      // Handle validation errors
      const validationErrors = Object.values(backendError.error).flat();
      if (validationErrors.length > 0) {
        return new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }
    }
  } else if (error.code === 'ECONNABORTED') {
    // Request timeout
    return new Error(`Request timeout. Please check your connection and try again.`);
  } else if (error.message === 'Network Error') {
    // Network error
    return new Error(`Network error. Please check your internet connection and try again.`);
  }
  
  // Return generic error if no specific error message
  return new Error(`Failed to complete ${operation}. Please try again.`);
};

// Utility function to retry failed requests
const retryRequest = async (requestFn, maxRetries = 2, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Transport APIs
export const transportApiService = {
  // Get transport by venue ID
  getTransportByVenueId: async (venueId, params = {}) => {
    try {
      return await axiosInstance.get(`${ACCREDITATION_BASE_URL}/venue/${venueId}/travel`, { params });
    } catch (error) {
      throw handleApiError(error, "fetch transport data");
    }
  },

  // Create new transport
  createTransport: async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        // Skip null, undefined, and empty string values, but allow 0 values
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          // Handle image field properly - only append if it's a valid File
          if (key === 'image') {
            if (data[key] instanceof File) {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      return await axiosInstance.post(`${ACCREDITATION_BASE_URL}/travel`, formData);
    } catch (error) {
      throw handleApiError(error, "create transport");
    }
  },

  // Update transport
  updateTransport: async (id, data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        // Skip null, undefined, and empty string values, but allow 0 values
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          // Handle image field properly - only append if it's a valid File
          if (key === 'image') {
            if (data[key] instanceof File) {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      return await axiosInstance.put(`${ACCREDITATION_BASE_URL}/travel/${id}`, formData);
    } catch (error) {
      throw handleApiError(error, "update transport");
    }
  },

  // Delete transport
  deleteTransport: async (id) => {
    try {
      return await axiosInstance.delete(`${ACCREDITATION_BASE_URL}/travel/${id}`);
    } catch (error) {
      throw handleApiError(error, "delete transport");
    }
  }
};

// Dining APIs
export const diningApiService = {
  // Get dining by venue ID
  getDiningByVenueId: async (venueId, params = {}) => {
    try {
      return await axiosInstance.get(`${ACCREDITATION_BASE_URL}/venue/${venueId}/dining`, { params });
    } catch (error) {
      throw handleApiError(error, "fetch dining data");
    }
  },

  // Create new dining
  createDining: async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        // Skip null, undefined, and empty string values, but allow 0 values
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          // Handle image field properly - only append if it's a valid File
          if (key === 'image') {
            if (data[key] instanceof File) {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      return await axiosInstance.post(`${ACCREDITATION_BASE_URL}/dining`, formData);
    } catch (error) {
      throw handleApiError(error, "create dining");
    }
  },

  // Update dining
  updateDining: async (id, data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        // Skip null, undefined, and empty string values, but allow 0 values
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          // Handle image field properly - only append if it's a valid File
          if (key === 'image') {
            if (data[key] instanceof File) {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      return await axiosInstance.put(`${ACCREDITATION_BASE_URL}/dining/${id}`, formData);
    } catch (error) {
      throw handleApiError(error, "update dining");
    }
  },

  // Delete dining
  deleteDining: async (id) => {
    try {
      return await axiosInstance.delete(`${ACCREDITATION_BASE_URL}/dining/${id}`);
    } catch (error) {
      throw handleApiError(error, "delete dining");
    }
  },

  // Get dining by ID
  getDiningById: async (id) => {
    try {
      return await axiosInstance.get(`${ACCREDITATION_BASE_URL}/dining/${id}`);
    } catch (error) {
      throw handleApiError(error, "fetch dining details");
    }
  },

  // Get all dining
  getAllDining: async (params = {}) => {
    try {
      return await axiosInstance.get(`${ACCREDITATION_BASE_URL}/dining`, { params });
    } catch (error) {
      throw handleApiError(error, "fetch dining data");
    }
  }
};

// Venue APIs
export const venueApiService = {
  // Get venue by ID
  getVenueById: async (id) => {
    try {
      // Use the main axiosInstance for venue calls since they might be on a different domain
      return await axiosInstance.get(`/venue/${id}`);
    } catch (error) {
      throw handleApiError(error, "fetch venue details");
    }
  },

  // Get venue with zones
  getVenueWithZones: async (id) => {
    try {
      return await axiosInstance.get(`/venue/${id}/zones`);
    } catch (error) {
      throw handleApiError(error, "fetch venue zones");
    }
  },

  // Get all venues
  getAllVenues: async (params = {}) => {
    try {
      return await axiosInstance.get(`/venue`, { params });
    } catch (error) {
      throw handleApiError(error, "fetch venues");
    }
  },

  // Get all cities
  getAllCities: () => {
    return axiosInstance.get(`/venue/allCities`);
  },

  // Get cities with venues
  getCitiesWithVenues: () => {
    return axiosInstance.get(`/venue/cities`);
  },

  // Get all venues and zones
  getAllVenuesAndZones: () => {
    return axiosInstance.get(`/venue/getAllVenuesAndZones`);
  }
};

// Dependency APIs for forms
export const dependencyApiService = {
  // User Categories
  getUserCategories: () => {
    return axiosInstance.get('/api/admin/getUserCategiryMain');
  },

  // User Category Types
  getUserCategoryTypes: () => {
    return axiosInstance.get('/api/admin/findUserCategoryType');
  },

  // User Sub Types
  getUserSubTypes: () => {
    return axiosInstance.get('/user-sub-type/all');
  },

  // Sports
  getSports: () => {
    return axiosInstance.get('/sports-name');
  },

  // Sub Sports
  getSubSports: () => {
    return axiosInstance.get('/sub-sport-category');
  }
};
