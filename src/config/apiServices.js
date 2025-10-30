import axios from "axios";
import { BASE_URL } from "./adminUrlConfig";


const HEADERS = {
  "Api-Version": "v1",
  responseType: "application/json",
  "Content-Type": "application/json",
  Accept: "application/json",
};

const HEADERSMULTIPART = {
  "Api-Version": "v1",
  responseType: "application/json",
  "Content-Type": "multipart/form-data",
  // Accept: "application/json",
};

export const UnAuthApiService = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});

export const ApiService = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});

export const FileUploadService = axios.create({
  baseURL: BASE_URL,
  headers: HEADERSMULTIPART,
});

ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    //console.log("token", token);
    if (token != null || token != undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls

ApiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/super-admin-login";
      localStorage.removeItem("access_token");
      return error.response;
    } else if (error.response.status === 404) {
      return error.response;
    } else {
      return error.response;
    }
  }
);

FileUploadService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token != null || token != undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    console.error("Error=>", error);
    return Promise.reject(error);
  }
);
