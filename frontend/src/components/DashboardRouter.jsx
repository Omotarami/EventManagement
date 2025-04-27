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
        navigate('/login');
        return;
      }
      
      // Route based on user role
      if (user.role === 'organizer') {
        navigate('/organizer-dashboard');
      } else if (user.role === 'attendee') {
        navigate('/attendee-dashboard');
      } else {
        // Default fallback
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