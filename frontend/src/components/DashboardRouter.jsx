import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardRouter = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      console.log("Checking authentication in DashboardRouter...");

      // Get auth data directly from localStorage
      const storedToken = localStorage.getItem('token');
      const storedUserString = localStorage.getItem('user');
      
      if (!storedToken || !storedUserString) {
        console.log("No token or user in localStorage, redirecting to login");
        navigate('/login');
        setIsChecking(false);
        return;
      }

      try {
        // Parse the user data
        const storedUser = JSON.parse(storedUserString);
        console.log("User account type:", storedUser.account_type);
        
        // Redirect based on account type
        if (storedUser.account_type === 'organizer') {
          console.log("Redirecting to organizer dashboard");
          navigate('/organizer-dashboard');
        } else if (storedUser.account_type === 'attendee') {
          console.log("Redirecting to attendee dashboard");
          navigate('/attendee-dashboard');
        } else {
          console.log("Unknown account type, redirecting to no-access");
          navigate("/no-access");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate('/login');
      } finally {
        setIsChecking(false);
      }
    };

    // Only run the check if no longer loading from context
    if (!loading) {
      checkAuthentication();
    }
  }, [loading, navigate]);

  // Show loading while checking auth
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return null;
};

export default DashboardRouter;