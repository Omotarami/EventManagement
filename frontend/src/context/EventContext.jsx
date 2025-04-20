import React, { createContext, useState, useEffect } from 'react';


export const EventContext = createContext();

const EventProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Add a new event
  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  // Update an existing event
  const updateEvent = (updatedEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  // Delete an event
  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  
  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById
    }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;