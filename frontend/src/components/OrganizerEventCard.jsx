/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreVertical, Calendar, Users, DollarSign, 
  Clock, MapPin, Tag, Ticket, Edit, Trash, BarChart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Event Card Component for Organizers
 * 
 * @param {Object} props
 * @param {Object} props.event - The event data object
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 */
const OrganizerEventCard = ({ event, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Calculate ticket sale percentage
  const soldPercentage = event.totalTickets > 0 
    ? (event.soldTickets / event.totalTickets) * 100 
    : 0;
  
  // Get color for status badge
  const getStatusColor = () => {
    switch(event.status?.toLowerCase()) {
      case 'published':
        return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
      case 'draft':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' };
      case 'ended':
        return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
    }
  };
  
  const statusColors = getStatusColor();
  
  // Get color for progress bar based on percentage
  const getProgressColor = () => {
    if (soldPercentage < 30) return 'bg-red-500';
    if (soldPercentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Handle card click to navigate to event details
  const handleCardClick = () => {
    if (event?.id) {
      navigate(`/events/${event.id}`);
    }
  };
  
  // Handle menu button click
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  // Handle edit action
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(event.id);
    setMenuOpen(false);
  };
  
  // Handle delete action
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(event.id);
    setMenuOpen(false);
  };
  
  // Handle view attendees click
  const handleViewAttendeesClick = (e) => {
    e.stopPropagation();
    navigate(`/events/${event.id}?tab=attendees`);
  };
  
  // Handle view revenue click
  const handleViewRevenueClick = (e) => {
    e.stopPropagation();
    navigate(`/events/${event.id}?tab=revenue`);
  };

  return (
    <motion.div 
      className="overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        {event.imageSrc ? (
          <img 
            src={event.imageSrc} 
            alt={event.title || 'Event'} 
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Calendar size={40} className="text-gray-400" />
          </div>
        )}
         {/* Image Overlay Gradient */}
        <div className="absolute inset-0 bg-black opacity-50 "></div>
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-sm font-medium bg-white text-teal-200 ${statusColors.bg} ${statusColors.text}`}>
          <span className={`inline-block w-2 h-2 rounded-full bg-teal-400 ${statusColors.dot} mr-1.5`}></span>
          {event.status || 'Status'}
        </div>
        
        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-3 left-3  bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
            {event.category}
          </div>
        )}
        
       
        
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{event.title || 'Untitled Event'}</h3>
          
          {/* Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={handleMenuClick}
              className="p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Menu"
            >
              <MoreVertical size={16} className="text-gray-500" />
            </button>
            
            {menuOpen && (
              <motion.div
                className="absolute right-0 z-10 mt-1 bg-white shadow-lg rounded-md overflow-hidden w-40 border border-gray-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center"
                >
                  <Edit size={14} className="text-gray-500 mr-2" />
                  Edit Event
                </button>
                <button
                  onClick={handleViewAttendeesClick}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center"
                >
                  <Users size={14} className="text-gray-500 mr-2" />
                  View Attendees
                </button>
                <button
                  onClick={handleViewRevenueClick}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center"
                >
                  <BarChart size={14} className="text-gray-500 mr-2" />
                  Revenue
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 flex items-center"
                >
                  <Trash size={14} className="mr-2" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Date and Location */}
        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3 gap-y-1">
          {event.startDate && (
            <div className="flex items-center mr-3">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(event.startDate)}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              <span className="truncate max-w-[150px]">{event.location}</span>
            </div>
          )}
        </div>
        
        {/* Key Stats */}
        <div className="flex justify-between mb-3 text-sm">
          <div>
            <div className="text-gray-500">Tickets Sold</div>
            <div className="font-medium text-gray-500">{event.soldTickets || 0}/{event.totalTickets || 0}</div>
          </div>
          
          <div>
            <div className="text-gray-500">Revenue</div>
            <div className="font-medium text-gray-500">
              {formatCurrency(event.grossAmount || 0)}
            </div>
          </div>
        </div>
        
        {/* Tickets Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full ${getProgressColor()}`}
            style={{ width: `${soldPercentage}%` }}
          ></div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${event.id}`);
            }}
            className="flex-grow outline-1 hover:bg-orange-400 text-gray-400 hover:text-white rounded-md py-2 text-sm font-medium flex items-center justify-center"
          >
            <Edit size={14} className="mr-1.5" />
            Manage Event
          </button>
          
          <button
            onClick={handleViewAttendeesClick}
            className="flex-grow outline-1 hover:bg-orange-400 text-gray-400 hover:text-white rounded-md py-2 text-sm font-medium flex items-center justify-center"
          >
            <Users size={14} className="mr-1.5" />
            {event.soldTickets || 0} Attendees
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizerEventCard;