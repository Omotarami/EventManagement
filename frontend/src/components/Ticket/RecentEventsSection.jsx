/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import PurchaseTicketButton from './PurchaseTicketButton';

const RecentEventsSection = ({ events }) => {
  const navigate = useNavigate();
  const { hasTicketForEvent } = useTickets();
  
 
  const sortedEvents = [...events]
    .filter(event => event.status === 'published')
    .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate))
    .slice(0, 6); 
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recently Added Events
      </h2>
      
      {sortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              hasTicket={hasTicketForEvent(event.id)}
              onViewDetails={() => navigate(`/event-details/${event.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No Recent Events</h3>
          <p className="text-gray-500">
            Check back soon for new events
          </p>
        </div>
      )}
    </div>
  );
};


const EventCard = ({ event, hasTicket, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
 
  const getLowestPrice = () => {
    if (!event.tickets || event.tickets.length === 0) {
      return event.price ? `$${event.price}` : 'Free';
    }
    
    const prices = event.tickets.map(ticket => ticket.price);
    const lowestPrice = Math.min(...prices);
    return lowestPrice > 0 ? `From $${lowestPrice}` : 'Free';
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Event Image */}
      <div className="relative h-40 overflow-hidden">
        {event.imageSrc ? (
          <img 
            src={event.imageSrc} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Calendar size={32} className="text-gray-400" />
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium shadow-sm">
          {getLowestPrice()}
        </div>
        
        {/* Category Badge */}
        {event.category && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
            {event.category}
          </div>
        )}
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
        
        <div className="mb-3 text-sm text-gray-600 space-y-1">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={14} className="mr-2" />
            <span>{event.startTime || '00:00'} {event.timezone || 'UTC'}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={14} className="mr-2" />
            <span className="truncate">{event.location || 'Online Event'}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {hasTicket ? (
            <button 
              onClick={onViewDetails}
              className="w-full text-center py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              View Ticket
            </button>
          ) : (
            <>
              <PurchaseTicketButton event={event} />
              <button
                onClick={onViewDetails}
                className="w-full text-center py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                More Info
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentEventsSection;