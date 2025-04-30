import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, User, Settings, Bell } from "lucide-react";

const DashboardNavbar = ({ userName = "Sarah Johnson" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  // Animation variants for logo letters
  const letterVariants = {
    hover: (i) => ({
      y: [0, -10, 0],
      color: i % 2 === 0 ? "#2A9D8F" : "#F4A261",
      transition: {
        y: {
          duration: 0.5,
          ease: "easeInOut",
          delay: i * 0.05,
          repeat: Infinity,
          repeatDelay: 1.5,
        },
        color: {
          duration: 0.2,
        },
      },
    }),
  };

  return (
    <nav className="bg-white py-3 px-6 flex items-center justify-between shadow-sm relative z-10">
      {/* Logo with animated letters */}
      <motion.div
        className="flex items-center cursor-pointer"
        initial="rest"
        animate="rest"
        whileHover="hover"
      >
        {Array.from("EVENTRO").map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className="text-2xl font-bold inline-block"
            style={{
              color: i < 4 ? "#2A9D8F" : "#F4A261",
              originY: 0.5,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>

      {/* User profile and dropdown */}
      <div className="relative">
        <motion.div
          className="flex items-center space-x-3 cursor-pointer py-1 px-2 rounded-full hover:bg-gray-100"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Notification dot */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatDelay: 2,
                duration: 1,
              }}
            >
              <Bell size={16} className="text-gray-600 mr-1" />
              <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.div>
          </div>
          {/* User name */}
          <span className="text-gray-700 font-small">{userName}</span>

          {/* Avatar */}
          <div className="relative">
            <img
              src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight2&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=Blank&clotheType=ShirtCrewNeck&clotheColor=Blue03&eyeType=Side&eyebrowType=AngryNatural&mouthType=Default&skinColor=Tanned"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          {/* Dropdown arrow */}
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={16} className="text-gray-600" />
          </motion.div>
        </motion.div>

        {/* Dropdown menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">Organizer</p>
              </div>

              <motion.a
                href="/organizer-dashboard/profile"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <User size={16} className="text-teal-600" />
                <span>My Profile</span>
              </motion.a>

              <motion.a
                href="/organizer-dashboard/settings"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Settings size={16} className="text-teal-600" />
                <span>Account Settings</span>
              </motion.a>

              <div className="border-t border-gray-100 my-1"></div>

              <motion.a
                href="/logout"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
