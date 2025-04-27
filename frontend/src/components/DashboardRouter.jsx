import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRouter = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth is loaded
    if (!loading) {
      if (!user) {
        // No user - redirect to login
        console.log("No user found, redirecting to login");
        navigate('/login');
        return;
      }
      
      // Log the user object for debugging
      console.log("DashboardRouter user:", user);
      console.log("Role from user object:", user.role);
      console.log("Account type from user object:", user.account_type);
      
      // Check both role properties for maximum compatibility
      const userRole = user.role || user.account_type;
      console.log("Determined user role:", userRole);
      
      // Route based on user role
      if (userRole === 'organizer') {
        console.log("Routing to organizer dashboard");
        navigate('/organizer-dashboard');
      } else if (userRole === 'attendee') {
        console.log("Routing to attendee dashboard");
        navigate('/attendee-dashboard');
      } else {
        // If role is undefined or unknown, default to attendee
        console.log("Unknown role, defaulting to attendee dashboard");
        navigate('/attendee-dashboard');
      }
    }
  }, [user, loading, navigate]);

  // Show loading indicator while checking auth
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <div className="ml-4 text-lg text-gray-600">Redirecting to your dashboard...</div>
      </div>
    );
  }

  return null; 
};

export default DashboardRouter;