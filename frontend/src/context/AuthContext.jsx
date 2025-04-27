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

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      let userData = null;

      // Determine user role based on email
      if (email.includes("organizer")) {
        userData = {
          id: 1,
          name: "Demo Organizer",
          email: email,
          role: "organizer",
        };
      } else {
        userData = {
          id: 2,
          name: "Demo Attendee",
          email: email,
          role: "attendee",
        };
      }

      // Store user data in localStorage with correct keys
      localStorage.setItem("user", JSON.stringify(userData));
      
      
      localStorage.setItem("token", "mock-auth-token-" + Date.now());
      
      setUser(userData);
      toast.success("Welcome back!");
      return userData;
    } catch (error) {
      toast.error("Invalid credentials");
      throw error;
    }
  };

  const signup = async (userData, userType) => {
    try {
      const newUser = {
        ...userData,
        id: Date.now(),
        role: userType,
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