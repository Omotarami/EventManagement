import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const AuthContext = createContext();


const API_URL = "https://13b6-197-227-97-128.ngrok-free.app/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);


  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token) {
        
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
       
          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const signup = async (formData, userType) => {
    try {
      setLoading(true);
      const endpoint = userType === "organizer" 
        ? `${API_URL}/auth/organizer/signup` 
        : `${API_URL}/auth/user/signup`;
      
      const response = await axios.post(endpoint, formData);
      
      toast.success(response.data.message || "Registration successful!");
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const loginAsAttendee = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
   
      if (response.data.user.account_type === "organizer") {
        throw new Error("This is an organizer account. Please use organizer login.");
      }
      
     
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
  
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
   
      setUser(response.data.user);
      
      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const loginAsOrganizer = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
   
      if (response.data.user.account_type !== "organizer") {
        throw new Error("This is not an organizer account. Please use attendee login.");
      }
      
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
   
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      
   
      setUser(response.data.user);
      
      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common["Authorization"];
    
  
    setUser(null);
    
    toast.success("Logged out successfully");
  };

  
  const isAuthenticated = () => {
    return !!user;
  };


  const isOrganizer = () => {
    return user && user.account_type === "organizer";
  };


  const isAttendee = () => {
    return user && user.account_type !== "organizer";
  };

  
  const contextValue = {
    user,
    loading,
    initialized,
    signup,
    loginAsAttendee,
    loginAsOrganizer,
    logout,
    isAuthenticated,
    isOrganizer,
    isAttendee
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};