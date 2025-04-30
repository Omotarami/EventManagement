import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [userTickets, setUserTickets] = useState([]);
  const [eventTickets, setEventTickets] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Hardcode the API URL for now - replace with your actual backend URL
  const API_URL = 'http://localhost:8080/api';
  
  // Load user tickets when authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchUserTickets(user.id);
    }
  }, [user, isAuthenticated]);

  // Get token for authenticated requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch tickets purchased by the user from the backend
  const fetchUserTickets = async (userId) => {
    if (!userId) return [];
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/ticket/user/${userId}`, {
        headers: getAuthHeader()
      });
      
      const tickets = response.data;
      setUserTickets(tickets);
      
      // Also store in localStorage for faster access
      localStorage.setItem('userTickets', JSON.stringify(tickets));
      
      return tickets;
    } catch (error) {
      console.error('Failed to fetch user tickets:', error);
      toast.error('Could not load your tickets');
      
      // Return empty array to prevent errors
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get available tickets for an event from the backend
  const getEventTickets = async (eventId) => {
    if (!eventId) return [];
    
    // Check if we already have tickets for this event in cache
    if (eventTickets[eventId]) {
      return eventTickets[eventId];
    }
    
    try {
      const response = await axios.get(`${API_URL}/ticket/event/${eventId}`);
      const tickets = response.data;
      
      // Save to state for caching
      setEventTickets(prev => ({
        ...prev,
        [eventId]: tickets
      }));
      
      return tickets;
    } catch (error) {
      console.error('Failed to fetch event tickets:', error);
      toast.error('Could not load ticket information');
      return [];
    }
  };

  // Purchase a ticket
  const purchaseTicket = async (eventId, ticketId, quantity = 1) => {
    if (!isAuthenticated()) {
      toast.error('Please log in to purchase tickets');
      return null;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/ticket/purchase`, 
        {
          user_id: user.id,
          event_id: eventId,
          ticket_id: ticketId,
          quantity
        },
        {
          headers: getAuthHeader()
        }
      );
      
      // Refresh user tickets after purchase
      await fetchUserTickets(user.id);
      
      toast.success('Ticket purchased successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      const errorMessage = error.response?.data?.error || 'Failed to purchase ticket';
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a ticket for a specific event
  const hasTicketForEvent = (eventId) => {
    if (!Array.isArray(userTickets) || !userTickets.length || !eventId) return false;
    return userTickets.some(ticket => String(ticket.eventId) === String(eventId));
  };

  // Get all tickets purchased by the user - ALWAYS return an array
  const getUserTickets = () => {
    return Array.isArray(userTickets) ? userTickets : [];
  };

  // Calculate event revenue (for organizers)
  const calculateEventRevenue = (eventId) => {
    if (!eventId || !Array.isArray(userTickets) || !userTickets.length) return 0;
    
    return userTickets
      .filter(ticket => String(ticket.eventId) === String(eventId))
      .reduce((total, ticket) => total + parseFloat(ticket.totalAmount || 0), 0);
  };

  // Get tickets by event ID
  const getTicketsByEvent = (eventId) => {
    if (!eventId || !Array.isArray(userTickets) || !userTickets.length) return [];
    return userTickets.filter(ticket => String(ticket.eventId) === String(eventId));
  };

  // Check in an attendee (for organizers)
  const checkInAttendee = async (attendeeId, checkInStatus) => {
    if (!isAuthenticated()) {
      toast.error('Please log in to perform check-in');
      return null;
    }
    
    try {
      const response = await axios.put(
        `${API_URL}/ticket/check-in/${attendeeId}`,
        { check_in_status: checkInStatus },
        {
          headers: getAuthHeader()
        }
      );
      
      toast.success('Check-in status updated!');
      return response.data;
    } catch (error) {
      console.error('Failed to update check-in status:', error);
      toast.error('Failed to update check-in status');
      return null;
    }
  };

  const contextValue = {
    userTickets,
    loading,
    fetchUserTickets,
    getEventTickets,
    purchaseTicket,
    hasTicketForEvent,
    getUserTickets,
    calculateEventRevenue,
    getTicketsByEvent,
    checkInAttendee
  };

  return (
    <TicketContext.Provider value={contextValue}>
      {children}
    </TicketContext.Provider>
  );
};

// Hook for easy context use
export const useTickets = () => useContext(TicketContext);

export default TicketProvider;