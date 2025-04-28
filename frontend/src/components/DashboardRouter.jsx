/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const DashboardRouter = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [redirectStatus, setRedirectStatus] = useState({
    message: "Checking your user role...",
    target: ""
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No user detected, redirect to onboarding
        setRedirectStatus({
          message: "No user detected. Redirecting to onboarding...",
          target: "/onboarding"
        });
        
        setTimeout(() => {
          navigate('/onboarding');
        }, 1500);
        
        return;
      }
      
      // Check user role
      const userRole = user.role || user.account_type;
      
      if (userRole === 'organizer') {
        setRedirectStatus({
          message: "Organizer detected! Redirecting to organizer dashboard...",
          target: "/organizer-dashboard"
        });
        
        setTimeout(() => {
          navigate('/organizer-dashboard');
        }, 1000);
      } else if (userRole === 'attendee') {
        setRedirectStatus({
          message: "Attendee detected! Redirecting to attendee dashboard...",
          target: "/attendee-dashboard"
        });
        
        setTimeout(() => {
          navigate('/attendee-dashboard');
        }, 1000);
      } else {
        // Default fallback if role is unclear
        setRedirectStatus({
          message: "User role unclear. Redirecting to attendee dashboard...",
          target: "/attendee-dashboard"
        });
        
        setTimeout(() => {
          navigate('/attendee-dashboard');
        }, 1500);
      }
    }
  }, [user, loading, navigate]);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <motion.div 
        className="text-center p-8 max-w-md"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="w-20 h-20 mx-auto mb-6"
          animate={{ 
            rotate: 360,
            transition: { duration: 2, ease: "linear", repeat: Infinity }
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
              fill="#F4A261"
            />
            <path 
              d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" 
              fill="#F4A261"
            />
            <path 
              d="M12 12C10.07 12 8.5 13.57 8.5 15.5V18H15.5V15.5C15.5 13.57 13.93 12 12 12Z" 
              fill="#F4A261"
            />
          </svg>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-4"
          variants={itemVariants}
        >
          Dashboard Router
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-6"
          variants={itemVariants}
        >
          {redirectStatus.message}
        </motion.p>
        
        <motion.div 
          className="w-full bg-gray-200 h-2 rounded-full overflow-hidden"
          variants={itemVariants}
        >
          <motion.div 
            className="h-full bg-orange-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
        
        <motion.div 
          className="mt-8"
          variants={itemVariants}
        >
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel and go to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardRouter;