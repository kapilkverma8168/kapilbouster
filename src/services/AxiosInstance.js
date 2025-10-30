import axios from "axios";
import { store } from "../store/store";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = localStorage.getItem("access_token") || state.auth.auth.idToken;
  // pass token in auth header
  config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== "/admin-login"
    ) {
      window.location.href = "/admin-login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
