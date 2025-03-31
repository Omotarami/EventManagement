import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';



const OnboardingPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 10 }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    },
    tap: { scale: 0.98 }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center p-6 font-sans">
      <motion.div 
        className="max-w-5xl w-full flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex flex-col items-center mb-10"
          variants={itemVariants}
        >
          {/* Logo */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
           Welcome to Even<span style={{ color: '#F4A261' }}>tro</span>!
          </h1>
          
          {/* Clap Image */}
          <motion.div 
            className="mt-4 mb-8"
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity,
              repeatType: "loop",
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <img 
              src="../public/icons/clap.svg" 
              alt="Clap" 
              className="w-20 h-20"
            />
          </motion.div>
          
          <motion.h2 
            className="text-2xl text-gray-600 font-medium mt-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Tell us what you want...
          </motion.h2>
        </motion.div>

        {/* Choice Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Create Events Card */}
          <motion.div 
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="p-8 flex flex-col items-center">
              {/* Fun Illustration */}
              <motion.div 
                className="mb-6"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                  ease: "easeInOut"
                }}
              >
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="#2A9D8F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M16 2V6M8 2V6M3 10H21M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01"
                    stroke="#2A9D8F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Be The Host</h3>
              
              <p className="text-gray-600 mb-6 text-center">
                Create amazing events, manage registrations, and build your community. Take control of your event planning journey!
              </p>
              
              <div className="h-px w-full bg-gray-200 my-4"></div>
              
              <h4 className="text-xl font-medium text-gray-700 mb-4">Manage Events</h4>
              
              <motion.button
                className="py-3 px-6 rounded-md font-medium text-white transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                style={{ backgroundColor: '#2A9D8F', width: '180px' }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link to="/signup/organizer" className="block w-full h-full">
                  Create Events
                </Link>
              </motion.button>
            </div>
          </motion.div>

          {/* Attend Events Card */}
          <motion.div 
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="p-8 flex flex-col items-center">
              {/* Fun Illustration */}
              <motion.div 
                className="mb-6"
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 5,
                  ease: "easeInOut"
                }}
              >
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="#F4A261"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                    stroke="#F4A261"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                    stroke="#F4A261"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                    stroke="#F4A261"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Join The Fun</h3>
              
              <p className="text-gray-600 mb-6 text-center">
                Discover exciting events in your area, connect with like-minded people, and create unforgettable memories together!
              </p>
              
              <div className="h-px w-full bg-gray-200 my-4"></div>
              
              <h4 className="text-xl font-medium text-gray-700 mb-4">Attend Events</h4>
              
              <motion.button
                className="py-3 px-6 rounded-md font-medium text-white transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                style={{ backgroundColor: '#F4A261', width: '180px' }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link to="/signup/attendee" className="block w-full h-full">
                  Find Events
                </Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Footer Text */}
        <motion.p 
          className="text-gray-500 mt-12 text-center"
          variants={itemVariants}
        >
          Join thousands of people who are already using Eventro for their event needs!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;