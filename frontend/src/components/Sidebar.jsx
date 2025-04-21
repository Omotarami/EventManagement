import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Navigation items for organizers 
  const organizerNavItems = [
    { name: 'Home', icon: '../public/icons/home.svg', id: 'dashboard', path: '/dashboard' },
    { name: 'Calendar', icon: '../public/icons/calendar.svg', id: 'calendar', path: '/calendar' },
    { name: 'Messages', icon: '../public/icons/messages.svg', id: 'messages', path: '/messages' },
    { name: 'Revenue', icon: '../public/icons/currency.svg', id: 'revenue', path: '/revenue' },
    { name: 'Tickets', icon: '../public/icons/tickets.svg', id: 'tickets', path: '/tickets' },
    { name: 'Settings', icon: '../public/icons/settings.svg', id: 'settings', path: '/settings' },
  ];

  // Navigation items for attendees (excluding Revenue)
  const attendeeNavItems = [
    { name: 'Home', icon: '../public/icons/home.svg', id: 'dashboard', path: '/attendee-dashboard' },
    { name: 'Calendar', icon: '../public/icons/calendar.svg', id: 'calendar', path: '/calendar' },
    { name: 'Messages', icon: '../public/icons/messages.svg', id: 'messages', path: '/messages' },
    { name: 'Tickets', icon: '../public/icons/tickets.svg', id: 'tickets', path: '/tickets' },
    { name: 'Settings', icon: '../public/icons/settings.svg', id: 'settings', path: '/settings' },
  ];

  // Choose nav items based on user role
  const navItems = user?.role === 'organizer' ? organizerNavItems : attendeeNavItems;

  // Set active index based on current path when component mounts
  useEffect(() => {
    const currentPath = location.pathname;
    const index = navItems.findIndex(item => currentPath === item.path);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname, navItems]);

  // Handle navigation item click
  const handleNavClick = (index, path) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <div className="fixed left-2 top-1/2 transform -translate-y-1/2 z-10">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-between"
        style={{ height: '400px', marginTop:'50px', paddingTop:'30px', width:'60px'}}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
                
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
                className={`relative p-1 rounded-lg transition-all duration-300 transform cursor-pointer ${
                  activeIndex === index 
                    ? 'bg-orange-100 text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleNavClick(index, item.path)}
              >
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className="w-5 h-5" 
                />
                
                {/* Indicator for active item */}
                {activeIndex === index && (
                  <motion.div 
                    className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-orange-200 "
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
        
        {/* Profile Section */}
        <div 
          className="relative mt-auto"
          onMouseEnter={() => setHoveredIndex('profile')}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div 
            className="p-1 rounded-full transition-all duration-300 transform cursor-pointer hover:bg-gray-100"
            onClick={() => navigate('/profile')}
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          {/* Profile Tooltip */}
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