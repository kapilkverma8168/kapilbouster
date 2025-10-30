import axios from "axios";
import { 
  ACCREDITATION_BASE_URL,
  GET_ACCREDITATION_SUMMARY,
  GET_ACCREDITATION_USER_TYPES,
  GET_ACCREDITATION_CARDS,
  UPDATE_ACCREDITATION_PRINT_STATUS,
  UPDATE_ACCREDITATION_BLACKLIST,
  UPDATE_ACCREDITATION_HANDOVER
} from "../config/adminUrlConfig";

// Enhanced error handling utility
export class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Response wrapper for consistent API responses
export class ApiResponse {
  constructor(data, success = true, message = '', totalItems = null, totalPages = null) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
    this.timestamp = new Date().toISOString();
  }
}

// Enhanced axios instance with better error handling
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };
      
      // Log request in development
      if (process.env.REACT_APP_ENABLE_API_LOGGING === "true" || process.env.NODE_ENV === "development") {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
          headers: config.headers
        });
      }
      
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(new ApiError('Request configuration failed', 0, 'REQUEST_ERROR', error));
    }
  );

  // Response interceptor with enhanced error handling
  instance.interceptors.response.use(
    (response) => {
      // Calculate request duration
      const duration = new Date() - response.config.metadata.startTime;
      
      // Log response in development
      if (process.env.REACT_APP_ENABLE_API_LOGGING === "true" || process.env.NODE_ENV === "development") {
        console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} completed in ${duration}ms`, {
          status: response.status,
          data: response.data
        });
      }
      
      return response;
    },
    (error) => {
      const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
      console.error(`API Request to ${error.config?.url} failed after ${duration}ms:`, error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        const message = data?.message || data?.error || `Server error: ${status}`;
        const code = data?.code || `HTTP_${status}`;
        
        // Handle specific status codes
        if (status === 401) {
          localStorage.removeItem("access_token");
          window.location.href = "/super-admin-login";
          throw new ApiError("Authentication failed. Please login again.", status, code, data);
        } else if (status === 403) {
          throw new ApiError("Access denied. You don't have permission to perform this action.", status, code, data);
        } else if (status === 404) {
          throw new ApiError("Resource not found.", status, code, data);
        } else if (status === 422) {
          throw new ApiError("Validation failed. Please check your input.", status, code, data);
        } else if (status >= 500) {
          throw new ApiError("Server error. Please try again later.", status, code, data);
        } else {
          throw new ApiError(message, status, code, data);
        }
      } else if (error.request) {
        // Network error
        throw new ApiError("Network error. Please check your connection.", 0, 'NETWORK_ERROR', error.request);
      } else {
        // Other error
        throw new ApiError("An unexpected error occurred.", 0, 'UNKNOWN_ERROR', error.message);
      }
    }
  );

  return instance;
};

// Create the main API instance
const accreditationApiService = createApiInstance(ACCREDITATION_BASE_URL);

// Enhanced API service with proper error handling and response structure
export const enhancedAccreditationService = {
  // Get summary data with proper error handling
  getSummary: async () => {
    try {
      const response = await accreditationApiService.get(GET_ACCREDITATION_SUMMARY);
      return new ApiResponse(
        response.data?.data || response.data,
        response.data?.success !== false,
        response.data?.message || 'Summary fetched successfully',
        response.data?.totalItems,
        response.data?.totalPages
      );
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      throw error;
    }
  },

  // Get printing summary
  getPrintingSummary: async () => {
    try {
      const response = await accreditationApiService.get("/user/summary/printing");
      return new ApiResponse(
        response.data?.data || response.data,
        response.data?.success !== false,
        response.data?.message || 'Printing summary fetched successfully',
        response.data?.totalItems,
        response.data?.totalPages
      );
    } catch (error) {
      console.error('Failed to fetch printing summary:', error);
      throw error;
    }
  },

  // Get handover summary
  getHandoverSummary: async () => {
    try {
      const response = await accreditationApiService.get("/user/summary/handover");
      return new ApiResponse(
        response.data?.data || response.data,
        response.data?.success !== false,
        response.data?.message || 'Handover summary fetched successfully',
        response.data?.totalItems,
        response.data?.totalPages
      );
    } catch (error) {
      console.error('Failed to fetch handover summary:', error);
      throw error;
    }
  },

  // Get user types with proper data mapping
  getUserTypes: async () => {
    try {
      const response = await accreditationApiService.get(GET_ACCREDITATION_USER_TYPES);
      const rawData = response.data?.data || response.data || [];
      
      // Ensure we have an array
      const dataArray = Array.isArray(rawData) ? rawData : [];
      
      // Map the data to consistent format
      const mappedData = dataArray.map((item, index) => ({
        id: item.id || index + 1,
        sub_category_id: item.sub_category_id || item.id || index + 1,
        sub_category_name_view: item.sub_category_name_view || item.user_type || item.name || `User Type ${index + 1}`,
        originalData: item // Keep original data for reference
      }));

      return new ApiResponse(
        mappedData,
        response.data?.success !== false,
        response.data?.message || 'User types fetched successfully',
        mappedData.length
      );
    } catch (error) {
      console.error('Failed to fetch user types:', error);
      throw error;
    }
  },

  // Get cards with enhanced filtering and pagination
  getCards: async (params = {}) => {
    try {
      // Clean up params - remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
      );

      const response = await accreditationApiService.get(GET_ACCREDITATION_CARDS, { 
        params: cleanParams 
      });
      
      const rawData = response.data?.data || response.data || [];
      const dataArray = Array.isArray(rawData) ? rawData : [];

      return new ApiResponse(
        dataArray,
        response.data?.success !== false,
        response.data?.message || 'Cards fetched successfully',
        response.data?.totalItems || dataArray.length,
        response.data?.totalPages
      );
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      throw error;
    }
  },

  // Update print status with enhanced error handling
  updatePrintStatus: async (cardIds, status) => {
    try {
      if (!cardIds || (Array.isArray(cardIds) && cardIds.length === 0)) {
        throw new ApiError("No card IDs provided", 400, 'VALIDATION_ERROR');
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new ApiError("Authentication token not found", 401, 'AUTH_ERROR');
      }

      const response = await accreditationApiService.put(
        UPDATE_ACCREDITATION_PRINT_STATUS,
        {
          card_ids: Array.isArray(cardIds) ? cardIds : [cardIds],
          physical_print_status: status
        }
      );

      return new ApiResponse(
        response.data?.data || response.data,
        response.data?.success !== false,
        response.data?.message || 'Print status updated successfully'
      );
    } catch (error) {
      console.error('Failed to update print status:', error);
      throw error;
    }
  },

  // Update blacklist status
  updateBlacklistStatus: async (cardIds, status) => {
    try {
      if (!cardIds || (Array.isArray(cardIds) && cardIds.length === 0)) {
        throw new ApiError("No card IDs provided", 400, 'VALIDATION_ERROR');
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new ApiError("Authentication token not found", 401, 'AUTH_ERROR');
      }

      const response = await accreditationApiService.put(
        UPDATE_ACCREDITATION_BLACKLIST,
        {
          card_ids: Array.isArray(cardIds) ? cardIds : [cardIds],
          status
        }
      );

      return new ApiResponse(
        response.data?.data || response.data,
        response.data?.success !== false,
        response.data?.message || 'Blacklist status updated successfully'
      );
    } catch (error) {
      console.error('Failed to update blacklist status:', error);
      throw error;
    }
  },

  // Export data with proper blob handling
  exportData: async (params = {}) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new ApiError("Authentication token not found", 401, 'AUTH_ERROR');
      }

      // Clean up params
      const cleanParams = Object.fromEntries(
        Object.entries({ ...params, excelDownload: true }).filter(([_, value]) => value !== undefined && value !== '')
      );

      const response = await accreditationApiService.get(GET_ACCREDITATION_CARDS, {
        params: cleanParams,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Validate blob response
      if (!response.data || response.data.size === 0) {
        throw new ApiError("No data received from server", 204, 'NO_DATA_ERROR');
      }

      return new ApiResponse(
        response.data,
        true,
        'Data exported successfully'
      );
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }
};

// Enhanced handover service
export const enhancedAccreditationHandoverService = {
  handoverCards: async (cardIds, payload = {}) => {
    try {
      if (!cardIds || (Array.isArray(cardIds) && cardIds.length === 0)) {
        throw new ApiError("No card IDs provided", 400, 'VALIDATION_ERROR');
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new ApiError("Authentication token not found", 401, 'AUTH_ERROR');
      }

      // Validate required payload fields (backend expects handover_to_* keys)
      const requiredFields = ['handover_to_name', 'handover_to_phone', 'handover_date', 'handover_time'];
      const missingFields = requiredFields.filter(field => !payload[field]);
      
      if (missingFields.length > 0) {
        throw new ApiError(`Missing required fields: ${missingFields.join(', ')}`, 400, 'VALIDATION_ERROR');
      }

      const response = await accreditationApiService.put(
        UPDATE_ACCREDITATION_HANDOVER,
        {
          card_ids: Array.isArray(cardIds) ? cardIds : [cardIds],
          ...payload
        }
      );

      return new ApiResponse(
        response.data?.data || response.data,
        response.data?.success !== false,
        response.data?.message || 'Cards handed over successfully'
      );
    } catch (error) {
      console.error('Failed to handover cards:', error);
      throw error;
    }
  }
};

// Utility function to handle API errors consistently
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details
    };
  }
  
  return {
    message: defaultMessage,
    status: 0,
    code: 'UNKNOWN_ERROR',
    details: error.message
  };
};

// Utility function to show user-friendly error messages
export const getErrorMessage = (error) => {
  const errorInfo = handleApiError(error);
  
  // Map error codes to user-friendly messages
  const errorMessages = {
    'AUTH_ERROR': 'Please login to continue',
    'NETWORK_ERROR': 'Please check your internet connection',
    'VALIDATION_ERROR': 'Please check your input and try again',
    'NO_DATA_ERROR': 'No data available',
    'REQUEST_ERROR': 'Request failed. Please try again'
  };

  return errorMessages[errorInfo.code] || errorInfo.message;
};

export default enhancedAccreditationService;
