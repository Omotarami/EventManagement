/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Tag, Ticket, 
  Heart, Share, Users, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import PurchaseTicketButton from '../components/Ticket/PurchaseTicketButton';

/**
 * Event Card Component for Attendees
 * 
 * @param {Object} props
 * @param {Object} props.event - The event data object
 */
const AttendeeEventCard = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const { hasTicketForEvent } = useTickets();
  
  // Check if user has a ticket
  const userHasTicket = hasTicketForEvent && event?.id 
    ? hasTicketForEvent(event.id) 
    : false;
  
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
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // If it's an object with time and period
    if (typeof timeString === 'object' && timeString.time && timeString.period) {
      return `${timeString.time} ${timeString.period}`;
    }
    
    return timeString;
  };
  
  // Calculate price display
  const getPriceDisplay = () => {
    // For events with ticket types
    if (event.tickets && event.tickets.length > 0) {
      const prices = event.tickets.map(ticket => ticket.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return minPrice > 0 ? `$${minPrice}` : 'Free';
      }
      return `From $${minPrice}`;
    }
    
    // For events with a single price
    return event.price ? `$${event.price}` : 'Free';
  };
  
  // Handle card click
  const handleCardClick = () => {
    if (event?.id) {
      navigate(`/event-details/${event.id}`);
    }
  };
  
  // Handle save button click
  const handleSaveClick = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Here you would implement actual saving logic
  };
  
  // Handle share button click
  const handleShareClick = (e) => {
    e.stopPropagation();
    
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.origin + `/event-details/${event.id}`
    };
    
    if (navigator.share) {
      navigator.share(shareData)
        .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareData.url)
        .then(() => alert("Event link copied to clipboard!"))
        .catch(err => console.error("Could not copy text:", err));
    }
  };
  
  // Calculate if event is happening soon (within 7 days)
  const isUpcoming = () => {
    if (!event.startDate) return false;
    
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 && diffDays <= 7;
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
          <motion.img 
            src={event.imageSrc} 
            alt={event.title || 'Event'} 
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Calendar size={40} className="text-gray-400" />
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium shadow-sm">
          {getPriceDisplay()}
        </div>
        
        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
            {event.category}
          </div>
        )}
        
        {/* "Happening Soon" Badge */}
        {isUpcoming() && (
          <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Happening Soon!
          </div>
        )}
        
        {/* Save/Share Controls */}
        <div className="absolute right-3 bottom-3 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveClick}
            className={`p-2 rounded-full ${isSaved ? 'bg-red-500 text-white' : 'bg-white bg-opacity-80 text-gray-700'}`}
          >
            <Heart size={16} className={isSaved ? 'fill-current' : ''} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShareClick}
            className="p-2 rounded-full bg-white bg-opacity-80 text-gray-700"
          >
            <Share size={16} />
          </motion.button>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{event.title || 'Untitled Event'}</h3>
        
        {/* Event Description Preview */}
        {event.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        )}
        
        {/* Date, Time and Location */}
        <div className="space-y-1.5 mb-4">
          {event.startDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={14} className="mr-2 text-gray-500" />
              <span>{formatDate(event.startDate)}</span>
            </div>
          )}
          
          {event.startTime && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={14} className="mr-2 text-gray-500" />
              <span>{formatTime(event.startTime)}</span>
              {event.endTime && <span> - {formatTime(event.endTime)}</span>}
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-2 text-gray-500" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
        
        {/* Attendee Count */}
        {event.soldTickets > 0 && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Users size={14} className="mr-2 text-gray-500" />
            <span>{event.soldTickets} {event.soldTickets === 1 ? 'person' : 'people'} attending</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {userHasTicket ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/tickets');
              }}
              className="flex-grow bg-green-500 hover:bg-green-600 text-white rounded-md py-2 text-sm font-medium flex items-center justify-center"
            >
              <Ticket size={14} className="mr-1.5" />
              View Ticket
            </button>
          ) : (
            <PurchaseTicketButton 
              event={event} 
              buttonStyle="flex-grow bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 text-sm font-medium flex items-center justify-center"
            />
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/event-details/${event.id}`);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md py-2 px-3 text-sm font-medium flex items-center justify-center"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendeeEventCard;