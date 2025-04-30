import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute - Component to protect routes based on authentication and user roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array} [props.allowedRoles] - Optional array of roles allowed to access the route
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  // Show loading indicator while authentication is initializing
  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to no-access page with information about the attempted route
    return (
      <Navigate 
        to="/no-access" 
        state={{ 
          from: location, 
          error: `You need to be logged in to access this page` 
        }} 
        replace 
      />
    );
  }

  // If allowedRoles is specified, check if user has required role
  if (allowedRoles.length > 0) {
    const userRole = user.account_type || "attendee"; // Default to attendee if not specified
    
    if (!allowedRoles.includes(userRole)) {
      // User doesn't have the required role
      return (
        <Navigate 
          to="/no-access" 
          state={{ 
            from: location, 
            error: `You need to be logged in as ${allowedRoles.join(" or ")} to access this page` 
          }} 
          replace 
        />
      );
    }
  }

  // If user is authenticated and has the required role, render the protected component
  return children;
};

export default ProtectedRoute;