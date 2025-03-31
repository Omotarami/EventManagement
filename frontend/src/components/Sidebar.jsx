import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Sidebar = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Navigation items 
  const navItems = [
    { name: 'Home', icon: '../public/icons/home.svg', id: 'dashboard' },
    { name: 'Calendar', icon: '../public/icons/calendar.svg', id: 'calendar' },
    { name: 'Messages', icon: '../public/icons/messages.svg', id: 'messages' },
    { name: 'Revenue', icon: '../public/icons/currency.svg', id: 'revenue' },
    { name: 'Tickets', icon: '../public/icons/tickets.svg', id: 'tickets' },
    { name: 'Settings', icon: '../public/icons/settings.svg', id: 'settings' },
  ];

  // Handle navigation item click
  const handleNavClick = (index, id) => {
    setActiveIndex(index);
    // Call the navigation callback if provided
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-10">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-between"
        style={{ height: '462px' }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo section */}
        <div className="mb-8 mt-2">
          <img 
            src="/icons/eventro-logo.svg" 
            alt="Eventro Logo" 
            className="w-10 h-10"
          />
        </div>
        
        {/* Navigation items */}
        <div className="flex flex-col space-y-8 flex-grow justify-center">
          {navItems.map((item, index) => (
            <div 
              key={index} 
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className={`relative p-2 rounded-lg transition-all duration-300 transform cursor-pointer ${
                  activeIndex === index 
                    ? 'bg-teal-500 text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleNavClick(index, item.id)}
              >
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className="w-6 h-6" 
                />
                
                {/* Indicator for active item */}
                {activeIndex === index && (
                  <motion.div 
                    className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-l"
                    layoutId="activeIndicator"
                  />
                )}
              </div>
              
              {/* Tooltip */}
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  {item.name}
                  <div 
                    className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
        
        {/* User profile/avatar at bottom */}
        <div className="mt-auto mb-2 relative">
          <div 
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setHoveredIndex('profile')}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onNavigate && onNavigate('profile')}
          >
            <img 
              src="/icons/user-avatar.svg" 
              alt="User Profile" 
              className="w-6 h-6"
            />
          </div>
          
          {/* Profile tooltip */}
          {hoveredIndex === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-full ml-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              My Profile
              <div 
                className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;