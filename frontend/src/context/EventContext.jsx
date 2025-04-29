/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from 'react';
import { eventApi } from '../api/eventApi'; 
import toast from 'react-hot-toast';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events for a user
  const fetchUserEvents = async (userId) => {
    setLoading(true);
    try {
      const response = await eventApi.getUserEvents(userId);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  // Add a new event
  const addEvent = async (eventData) => {
    setLoading(true);
    try {
      // If eventData is a FormData object, use it directly
      // Otherwise, convert it to FormData
      const formData = eventData instanceof FormData 
        ? eventData 
        : createFormDataFromObject(eventData);

      const response = await eventApi.createEvent(formData);
      setEvents(prevEvents => [...prevEvents, response.data.event]);
      setError(null);
      return response.data.event;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (eventId, eventData) => {
    setLoading(true);
    try {
      const response = await eventApi.updateEvent(eventId, eventData);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? response.data : event
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (eventId) => {
    setLoading(true);
    try {
      await eventApi.deleteEvent(eventId);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      setError(null);
      toast.success('Event deleted successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single event by ID
  const getEventById = async (eventId) => {
    setLoading(true);
    try {
      const response = await eventApi.getEventById(eventId);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch event details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Utility function to convert object to FormData
  const createFormDataFromObject = (data) => {
    const formData = new FormData();
    
    // Append all top-level properties
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        // Handle arrays (like images, tickets, etc.)
        data[key].forEach((item, index) => {
          // For file uploads
          if (item instanceof File) {
            formData.append(`images`, item);
          } else {
            // For other array items, convert to JSON string
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          }
        });
      } else {
        // Handle non-array values
        formData.append(key, data[key]);
      }
    });

    return formData;
  };

  // Context value
  const contextValue = {
    events,
    loading,
    error,
    fetchUserEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    setEvents
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;