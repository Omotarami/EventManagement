import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical } from 'lucide-react';

/**
 * EventCard Component
 * 
 * @param {Object} props
 * @param {string} props.eventName - Name of the event
 * @param {number} props.soldTickets - Number of tickets sold
 * @param {number} props.totalTickets - Total available tickets
 * @param {number} props.grossAmount - Gross revenue amount
 * @param {string} props.status - Current status of the event (OnSale, Draft, etc.)
 * @param {string} props.imageSrc - Source URL for the event image
 * @param {function} props.onEdit - Function to call when Edit is clicked
 * @param {function} props.onDelete - Function to call when Delete is clicked
 */
const EventCard = ({
  eventName,
  soldTickets,
  totalTickets,
  grossAmount,
  status = 'OnSale',
  imageSrc,
  onEdit,
  onDelete
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
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
  
  // Calculate percentage for progress bar
  const soldPercentage = (soldTickets / totalTickets) * 100;
  
  // Determine status color
  const getStatusColor = () => {
    switch(status) {
      case 'OnSale': return '#2A9D8F';
      case 'Draft': return '#E9C46A';
      case 'Ended': return '#E76F51';
      default: return '#2A9D8F';
    }
  };
  
  return (
    <div className="relative border border-gray-200 rounded-lg max-w-sm">
      {/* Image Area */}
      <div className="bg-gray-200 h-36 rounded-t-lg relative">
        {imageSrc && (
          <img 
            src={imageSrc} 
            alt={eventName} 
            className="w-full h-full object-cover rounded-t-lg"
          />
        )}
        
        {/* Status Indicator */}
        <div className="absolute top-3 right-3 flex items-center">
          <span className="h-3 w-3 rounded-full mr-1.5" style={{ backgroundColor: getStatusColor() }}></span>
          <span className="text-sm font-medium">{status}</span>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{`Event Name: ${eventName}`}</h3>
        
        {/* Tickets Sold Progress */}
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Sold:</span>
            <span className="text-xs text-gray-500">{`${soldTickets}/${totalTickets}`}</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div 
              className="h-2 rounded-full" 
              style={{ 
                width: `${soldPercentage}%`,
                backgroundColor: '#E9C46A'
              }}
            ></div>
          </div>
        </div>
        
        {/* Gross Amount */}
        <div className="text-sm font-medium">
          Gross: ${grossAmount}
        </div>
      </div>
      
      {/* Menu Button */}
      <div className="absolute bottom-3 right-3" ref={menuRef}>
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Menu"
        >
          <MoreVertical size={20} />
        </button>
        
        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-1 bg-white shadow-lg rounded-lg py-1 w-24 z-10">
            <button 
              onClick={() => {
                onEdit();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Edit
            </button>
            <button 
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

EventCard.propTypes = {
  eventName: PropTypes.string.isRequired,
  soldTickets: PropTypes.number.isRequired,
  totalTickets: PropTypes.number.isRequired,
  grossAmount: PropTypes.number.isRequired,
  status: PropTypes.string,
  imageSrc: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EventCard;