import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Generic login function (kept for compatibility)
  const login = async (email, password) => {
    // Determine which login function to use based on email
    if (email.includes("organizer")) {
      return loginAsOrganizer(email, password);
    } else {
      return loginAsAttendee(email, password);
    }
  };

  // Specific login for attendees
  const loginAsAttendee = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Create attendee user data
      const userData = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        role: "attendee",
        account_type: "attendee"
      };

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", "mock-auth-token-" + Date.now());
      
      setUser(userData);
      toast.success("Welcome back, Attendee!");
      return userData;
    } catch (error) {
      toast.error("Invalid credentials");
      throw error;
    }
  };

  // Specific login for organizers
  const loginAsOrganizer = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Create organizer user data
      const userData = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        role: "organizer",
        account_type: "organizer"
      };

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", "mock-auth-token-" + Date.now());
      
      setUser(userData);
      toast.success("Welcome back, Organizer!");
      return userData;
    } catch (error) {
      toast.error("Invalid credentials");
      throw error;
    }
  };

  // Signup function with role passed explicitly
  const signup = async (userData, userType) => {
    try {
      const newUser = {
        ...userData,
        id: Date.now(),
        role: userType,
        account_type: userType
      };

      // Use the same keys as in login
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", "mock-auth-token-" + Date.now());
      
      setUser(newUser);
      toast.success("Account created successfully!");
      return newUser;
    } catch (error) {
      toast.error("Signup failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    loginAsAttendee,
    loginAsOrganizer,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};