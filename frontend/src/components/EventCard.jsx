/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  MoreVertical, Calendar, Users, DollarSign, 
  Clock, MapPin, Tag, Ticket, MessageCircle 
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import PurchaseTicketButton from './Ticket/PurchaseTicketButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A versatile event card component that changes behavior based on user role
 * 
 * @param {Object} props
 * @param {string} props.eventName 
 * @param {number} props.soldTickets 
 * @param {number} props.totalTickets 
 * @param {number} props.grossAmount 
 * @param {string} props.status 
 * @param {string} props.imageSrc
 * @param {string} props.eventDate 
 * @param {string} props.location 
 * @param {string} props.category 
 * @param {function} props.onEdit 
 * @param {function} props.onDelete 
 * @param {function} props.onClick 
 * @param {Object} props.event
 * @param {string} props.userRole 
 */
const EventCard = ({
  eventName,
  soldTickets = 0,
  totalTickets = 0,
  grossAmount = 0,
  status = 'published',
  imageSrc,
  eventDate,
  location,
  category,
  onEdit,
  onDelete,
  onClick,
  event,
  userRole = null
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const { hasTicketForEvent } = useTickets();
  const navigate = useNavigate();
  const { user } = useAuth();
  

  const userHasTicket = hasTicketForEvent && event?.id ? hasTicketForEvent(event.id) : false;

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
  
 
  const soldPercentage = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;
  
  
  const formattedGrossAmount = grossAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  

  const getStatusSettings = () => {
    switch(status.toLowerCase()) {
      case 'published':
      case 'onsale':
        return {
          color: '#2A9D8F',
          bgColor: 'rgba(42, 157, 143, 0.1)',
          text: 'Published'
        };
      case 'draft':
        return {
          color: '#E9C46A',
          bgColor: 'rgba(233, 196, 106, 0.1)',
          text: 'Draft'
        };
      case 'ended':
        return {
          color: '#E76F51',
          bgColor: 'rgba(231, 111, 81, 0.1)',
          text: 'Ended'
        };
      default:
        return {
          color: '#2A9D8F',
          bgColor: 'rgba(42, 157, 143, 0.1)',
          text: status
        };
    }
  };
  
  const statusSettings = getStatusSettings();
  
  const getProgressColor = () => {
    if (soldPercentage < 30) return '#E76F51'; 
    if (soldPercentage < 70) return '#E9C46A'; 
    return '#2A9D8F'; 
  };
  
  
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
    setMenuOpen(false);
  };
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
    setMenuOpen(false);
  };
  
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (event?.id) {
     
      if (userRole === 'organizer') {
        navigate(`/events/${event.id}`);
      } else if (userRole === 'attendee') {
        navigate(`/event-details/${event.id}`);
      }
    }
  };

  
  const handleViewAttendeesClick = (e) => {
    e.stopPropagation();
    if (event?.id) {
      navigate(`/event-attendees/${event.id}`);
    }
  };

  return (
    <motion.div 
      className="relative border border-gray-200 overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      onClick={handleCardClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative h-48 overflow-hidden">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={eventName} 
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Calendar size={40} className="text-black" />
          </div>
        )}
        
        {/* Status Badge */}
        <div 
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: statusSettings.bgColor,
            color: statusSettings.color
          }}
        >
          {statusSettings.text}
        </div>
        
        {/* Category Badge (if provided) */}
        {category && (
          <div className="absolute top-3 left-3 flex items-center space-x-1 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
            <Tag size={12} />
            <span>{category}</span>
          </div>
        )}
        
        {/* Image Overlay Gradient */}
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        {/* Event Title */}
        <h3 className="text-lg font-bold text-black mb-2 line-clamp-1">{eventName}</h3>
        
        {/* Event Date & Location (if provided) */}
        {(eventDate || location) && (
          <div className="flex flex-wrap items-center mb-3 text-sm text-black space-x-3">
            {eventDate && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{eventDate}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                <span className="truncate max-w-[150px]">{location}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Tickets Sold Progress - Show for all users */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium flex items-center">
              <Users size={14} className="mr-1 text-black" />
              Tickets Sold
            </span>
            <span className="text-sm font-medium">{soldTickets}/{totalTickets}</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${soldPercentage}%`,
                backgroundColor: getProgressColor()
              }}
            ></div>
          </div>
        </div>
        
        {/* Gross Amount - Only show for organizers */}
        {userRole === 'organizer' && (
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium flex items-center">
              <DollarSign size={14} className="mr-1 text-black" />
              Revenue
            </span>
            <span className="font-bold text-base">${formattedGrossAmount}</span>
          </div>
        )}
      </div>
      
      {/* Action Buttons - Different for each role */}
      <div className="p-4 pt-0 flex gap-2">
        {/* Attendee Actions */}
        {userRole === "attendee" && status === 'published' && (
          <div className="w-full flex gap-2">
            {/* Show appropriate ticket action */}
            <div className="flex-grow">
              {userHasTicket ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tickets`);
                  }}
                  className="w-full text-center py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
                >
                  <Ticket size={16} className="mr-2" />
                  View Ticket
                </button>
              ) : (
                <PurchaseTicketButton 
                  event={event} 
                  buttonStyle="w-full text-center py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex items-center justify-center text-sm"
                />
              )}
            </div>
            
            {/* View other attendees button (for networking) */}
            {userHasTicket && (
              <button
                onClick={handleViewAttendeesClick}
                className="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center justify-center text-sm"
                title="View other attendees"
              >
                <MessageCircle size={16} />
              </button>
            )}
          </div>
        )}
        
        {/* Organizer Actions */}
        {userRole === "organizer" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/${event?.id}`);
              }}
              className="flex-grow text-center py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex items-center justify-center text-sm"
            >
              <Ticket size={16} className="mr-2" />
              Manage Event
            </button>
            
            {/* Menu Button for Organizers */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={handleMenuClick} 
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                aria-label="Menu"
              >
                <MoreVertical size={16} className="text-black" />
              </button>
              
              {/* Dropdown Menu */}
              {menuOpen && (
                <motion.div 
                  className="absolute right-0 bottom-full mb-2 bg-white shadow-lg rounded-lg overflow-hidden z-10 w-32"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <button 
                    onClick={handleEditClick}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={handleDeleteClick}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 flex items-center"
                  >
                    Delete
                  </button>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

EventCard.propTypes = {
  eventName: PropTypes.string.isRequired,
  soldTickets: PropTypes.number,
  totalTickets: PropTypes.number,
  grossAmount: PropTypes.number,
  status: PropTypes.string,
  imageSrc: PropTypes.string,
  eventDate: PropTypes.string,
  location: PropTypes.string,
  category: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  event: PropTypes.object,
  userRole: PropTypes.string
};

export default EventCard;