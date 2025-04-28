/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import AttendeeEventCard from './AttendeeEventCard';

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
            <AttendeeEventCard 
              key={event.id} 
              event={event} 
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

export default RecentEventsSection;