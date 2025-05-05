import axios from "axios";
import toast from "react-hot-toast";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://13b6-197-227-97-128.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds authorization token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle auth errors
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401 && !originalRequest._retry) {
        // Handle token expiration
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Show notification
        toast.error("Your session has expired. Please log in again.");

        // Redirect to login page
        window.location.href = "/login";
      }

      // Show error messages from server
      if (error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      }
    } else {
      // Network error or other issues
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
