/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaTicketAlt, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const NoAccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loginType, setLoginType] = useState("attendee"); 
  
  // Detect which role the user might be trying to access
  useEffect(() => {
    // Check if the blocked route was specifically for organizers
    if (location.state?.from?.pathname?.includes("organizer") || 
        location.state?.error?.includes("organizer")) {
      setLoginType("organizer");
    }
  }, [location]);
  
  const handleLoginRedirect = () => {
    // Redirect to the appropriate login page based on detected role
    if (loginType === "organizer") {
      navigate("/login/organizer");
    } else {
      navigate("/login/attendee");
    }
  };

  const handleSignupRedirect = () => {
    // Redirect to the appropriate signup page based on detected role
    if (loginType === "organizer") {
      navigate("/signup/organizer");
    } else {
      navigate("/signup/attendee");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        {/* Animated Lock Character */}
        <motion.div
          className="mb-8 relative"
          animate={{
            rotate: [-5, 5, -5],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
            <FaLock size={50} color="#F97316" />
            <motion.div
              className="absolute -bottom-1 -right-1 bg-red-500 rounded-full w-10 h-10 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-white text-lg font-bold">!</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Playful Warning Message */}
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Whoa there, adventurer!
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {location.state?.error || `This area is locked tighter than a treasure chest! 🔒
          You need to be logged in as a${loginType === "organizer" ? "n organizer" : "n attendee"} to access this area.`}
        </motion.p>

        {/* Floating emojis */}
        <div className="relative h-16">
          <motion.span
            className="absolute text-3xl"
            style={{ left: "20%", top: "0" }}
            animate={{
              y: [0, -20, 0],
              x: [-5, 5, -5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🔐
          </motion.span>
          <motion.span
            className="absolute text-3xl"
            style={{ left: "50%", top: "20%" }}
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            🚫
          </motion.span>
          <motion.span
            className="absolute text-3xl"
            style={{ left: "80%", top: "10%" }}
            animate={{
              y: [0, -25, 0],
              x: [5, -5, 5],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          >
            🛡️
          </motion.span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginRedirect}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium shadow-md hover:bg-orange-600 transition-colors"
          >
            Log in as {loginType === "organizer" ? "Organizer" : "Attendee"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignupRedirect}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium shadow-md hover:bg-teal-700 transition-colors"
          >
            Sign up as {loginType === "organizer" ? "Organizer" : "Attendee"}
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Return to Home
        </motion.button>

        {/* Toggle login type */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Not a{loginType === "organizer" ? "n organizer" : "n attendee"}?
            <button
              onClick={() => setLoginType(loginType === "organizer" ? "attendee" : "organizer")}
              className="ml-2 text-orange-500 hover:text-orange-700 font-medium"
            >
              Switch to {loginType === "organizer" ? "Attendee" : "Organizer"} Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NoAccessPage;