import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, isOrganizer, isAttendee, loading, initialized } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still initializing
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
          error: `You need to be logged in${requiredRole ? ` as ${requiredRole}` : ""} to access this page` 
        }} 
        replace 
      />
    );
  }

  if (requiredRole === "organizer" && !isOrganizer()) {
    return (
      <Navigate 
        to="/no-access" 
        state={{ 
          from: location, 
          error: "You need to be logged in as an organizer to access this page" 
        }} 
        replace 
      />
    );
  }

  if (requiredRole === "attendee" && !isAttendee()) {
    return (
      <Navigate 
        to="/no-access" 
        state={{ 
          from: location, 
          error: "You need to be logged in as an attendee to access this page" 
        }} 
        replace 
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;