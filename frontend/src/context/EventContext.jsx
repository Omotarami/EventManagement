/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { eventApi } from '../api/eventApi'; 
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, initialized } = useAuth();

  // Auto-fetch events when user is authenticated
  useEffect(() => {
    // Only fetch when auth is initialized and user is logged in
    if (initialized && isAuthenticated() && user) {
      console.log('User authenticated, fetching events for user ID:', user.id);
      if (user.account_type === 'organizer') {
        // Organizers see their own events
        fetchUserEvents(user.id);
      } else {
        // Attendees see all published events
        fetchPublicEvents();
      }
    }
  }, [initialized, user, isAuthenticated]);

  // Fetch events for a user (organizer)
  const fetchUserEvents = async (userId) => {
    setLoading(true);
    try {
      const response = await eventApi.getUserEvents(userId);
      setEvents(response.data);
      console.log('Organizer events fetched successfully:', response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch organizer events:', err);
      toast.error('Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch public events for attendees
  const fetchPublicEvents = async () => {
    setLoading(true);
    try {
      const response = await eventApi.getAllEvents();
      setEvents(response.data);
      console.log('Public events fetched successfully:', response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch public events:', err);
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
      toast.success('Event created successfully!');
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
      toast.success('Event updated successfully!');
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
    fetchPublicEvents,
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