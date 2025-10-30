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

const accreditationApiService = axios.create({
  baseURL: ACCREDITATION_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

accreditationApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

accreditationApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/super-admin-login";
    }
    return Promise.reject(error);
  }
);

export const accreditationService = {
  getSummary: async () => {
    try {
      const response = await accreditationApiService.get(GET_ACCREDITATION_SUMMARY);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch summary: ${error.message}`);
    }
  },

  getPrintingSummary: async () => {
    try {
      const response = await accreditationApiService.get("/user/summary/printing");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch printing summary: ${error.message}`);
    }
  },

  getHandoverSummary: async () => {
    try {
      const response = await accreditationApiService.get("/user/summary/handover");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch handover summary: ${error.message}`);
    }
  },

  getUserTypes: async () => {
    try {
      const response = await accreditationApiService.get(GET_ACCREDITATION_USER_TYPES);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user types: ${error.message}`);
    }
  },

  getCards: async (params = {}) => {
    try {
      const response = await accreditationApiService.get(GET_ACCREDITATION_CARDS, { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch cards: ${error.message}`);
    }
  },

  updatePrintStatus: async (cardIds, status) => {
    try {
      const response = await accreditationApiService.put(UPDATE_ACCREDITATION_PRINT_STATUS, {
        card_ids: Array.isArray(cardIds) ? cardIds : [cardIds],
        physical_print_status: status
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update print status: ${error.message}`);
    }
  },

  updateBlacklistStatus: async (cardIds, status) => {
    try {
      const response = await accreditationApiService.put(UPDATE_ACCREDITATION_BLACKLIST, {
        card_ids: Array.isArray(cardIds) ? cardIds : [cardIds],
        status
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update blacklist status: ${error.message}`);
    }
  }
};

export const accreditationHandoverService = {
  handoverCards: async (cardIds, payload = {}) => {
    try {
      const response = await accreditationApiService.put(UPDATE_ACCREDITATION_HANDOVER, {
        card_ids: Array.isArray(cardIds) ? cardIds : [cardIds],
        ...payload
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to handover cards: ${error.message}`);
    }
  }
};

export default accreditationService;
