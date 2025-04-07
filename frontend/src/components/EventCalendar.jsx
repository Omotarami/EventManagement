/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const EventCalendar = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  // Month names with fun emoji
  const monthNames = [
    "January ⛄", "February 💝", "March 🌷", "April 🌧️", 
    "May 🌻", "June ☀️", "July 🏖️", "August 🍉", 
    "September 🍂", "October 🎃", "November 🦃", "December 🎄"
  ];
  
  // Fun day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Get all days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      days.push({
        day,
        date,
        events: dayEvents,
        isToday: isToday(date),
        hasEvents: dayEvents.length > 0
      });
    }
    
    return days;
  };
  
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  // Handle day click
  const handleDayClick = (day) => {
    if (!day.day) return; // Don't select empty days
    
    setSelectedDate(day.date);
    
    if (day.hasEvents) {
      setSelectedEvents(day.events);
      setShowEventPopup(true);
    } else {
      setShowEventPopup(false);
    }
  };
  
  // Get calendar days
  const calendarDays = getDaysInMonth(currentDate);
  
  return (
    <div className="calendar-container">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex text-sm px-2 py-1 bg-orange-100 rounded-full text-orange-500">
            <CalendarIcon size={16} className="mr-1" />
            <span>{events.length} events</span>
          </div>
        </motion.div>
        
        <div className="flex gap-2">
          <motion.button
            className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevMonth}
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextMonth}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="rounded-xl overflow-hidden bg-white shadow-md">
        {/* Day names header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((day, index) => (
            <div 
              key={day} 
              className={`py-3 text-center text-sm font-medium ${
                index === 0 || index === 6 ? 'text-orange-400' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          <AnimatePresence>
            {calendarDays.map((day, index) => (
              <motion.div
                key={`day-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.2,
                  delay: index * 0.01, // Staggered animation
                }}
                className={`
                  relative h-32 p-2 border-b border-r border-gray-100
                  ${!day.day ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}
                  ${day.isToday ? 'bg-orange-50' : ''}
                  ${selectedDate && day.date && selectedDate.getTime() === day.date.getTime() ? 'ring-2 ring-orange-400 ring-inset' : ''}
                `}
                onClick={() => handleDayClick(day)}
              >
                {day.day && (
                  <>
                    <div className="flex justify-between items-start">
                      <span className={`
                        inline-block rounded-full w-7 h-7 text-center leading-7
                        ${day.isToday ? 'bg-orange-400 text-white font-bold' : 'text-gray-700'}
                      `}>
                        {day.day}
                      </span>
                      
                      {/* Small dot indicator for events */}
                      {day.hasEvents && (
                        <motion.div 
                          className="absolute top-2 right-2 w-3 h-3 rounded-full bg-teal-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500,
                            damping: 15
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Event previews */}
                    <div className="mt-1 space-y-1 overflow-hidden max-h-20">
                      {day.events.slice(0, 2).map((event, eventIndex) => (
                        <motion.div
                          key={`event-${eventIndex}`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + (eventIndex * 0.1) }}
                          className="px-2 py-1 text-xs rounded bg-teal-100 text-teal-800 truncate"
                          style={{ backgroundColor: event.color || '#2A9D8F' }}
                        >
                          {event.title}
                        </motion.div>
                      ))}
                      
                      {/* More events indicator */}
                      {day.events.length > 2 && (
                        <div className="text-xs text-gray-500 pl-2">
                          +{day.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Event popup */}
      <AnimatePresence>
        {showEventPopup && selectedDate && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventPopup(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-200 bg-orange-50">
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}
                </p>
              </div>
              
              <div className="p-5 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {selectedEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-800">
                          {event.time}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
                <motion.button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEventPopup(false)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventCalendar;