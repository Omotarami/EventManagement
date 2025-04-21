import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Get authentication data from localStorage
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!storedToken) {
          setAuthError("No token found in localStorage");
          setIsAuthenticated(false);
          return;
        }

        if (!storedUser) {
          setAuthError("No user data found in localStorage");
          setIsAuthenticated(false);
          return;
        }

        // Try parsing the user data
        try {
          const parsedUser = JSON.parse(storedUser);

          if (!parsedUser) {
            setAuthError("User data is null or invalid");
            setIsAuthenticated(false);
            return;
          }

          // Authentication successful
          setUserData(parsedUser);
          setIsAuthenticated(true);
          setAuthError(null);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          setAuthError("Failed to parse user data");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setAuthError("Unexpected error during authentication check");
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show debugging information if in development mode
  if (process.env.NODE_ENV === "development" && authError) {
    console.error("Authentication error:", authError);
  }

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 text-sm text-gray-500">
            Checking authentication...
          </div>
        )}
      </div>
    );
  }

  // If user is not authenticated, redirect to no-access page
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/no-access"
        state={{ from: location, error: authError }}
        replace
      />
    );
  }

  // Check roles if allowedRoles is specified
  if (allowedRoles.length > 0) {
    const userRole = userData.account_type || userData.role;

    if (!allowedRoles.includes(userRole)) {
      return (
        <Navigate
          to="/no-access"
          state={{ from: location, error: "Insufficient permissions" }}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
