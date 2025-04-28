import axios from "axios";
import toast from "react-hot-toast";


const api = axios.create({
  baseURL: "http://localhost:8080/api",
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
        // Handle token expiration - could add token refresh logic here
        
        // For now, just log the user out
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Show notification
        toast.error("Your session has expired. Please log in again.");
        
        // Redirect to login page
        window.location.href = "/login/attendee";
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