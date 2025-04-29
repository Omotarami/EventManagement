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
  const API_URL = 'http://localhost:8080/api';

  // Load user tickets when authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchUserTickets(user.id);
    }
  }, [user, isAuthenticated]);

  // Fetch tickets purchased by the user
  const fetchUserTickets = async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/ticket/user/${userId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      
      setUserTickets(response.data);
      
      // Also store in localStorage for faster access
      localStorage.setItem('userTickets', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user tickets:', error);
      toast.error('Could not load your tickets');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get available tickets for an event
  const getEventTickets = async (eventId) => {
    if (!eventId) return [];
    
    // Check if we already have tickets for this event
    if (eventTickets[eventId]) {
      return eventTickets[eventId];
    }
    
    try {
      const response = await axios.get(`${API_URL}/ticket/event/${eventId}`);
      
      // Save to state
      setEventTickets(prev => ({
        ...prev,
        [eventId]: response.data
      }));
      
      return response.data;
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
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/ticket/purchase`,
        {
          user_id: user.id,
          event_id: eventId,
          ticket_id: ticketId,
          quantity
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      
      // Refresh user tickets
      fetchUserTickets(user.id);
      
      toast.success('Ticket purchased successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      toast.error(error.response?.data?.error || 'Failed to purchase ticket');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a ticket for a specific event
  const hasTicketForEvent = (eventId) => {
    if (!userTickets.length || !eventId) return false;
    return userTickets.some(ticket => parseInt(ticket.eventId) === parseInt(eventId));
  };

  // Get all tickets purchased by the user
  const getUserTickets = () => {
    return userTickets;
  };

  // Calculate event revenue (for organizers)
  const calculateEventRevenue = (eventId) => {
    if (!eventId || !userTickets.length) return 0;
    
    return userTickets
      .filter(ticket => parseInt(ticket.eventId) === parseInt(eventId))
      .reduce((total, ticket) => total + parseFloat(ticket.totalAmount || 0), 0);
  };

  // Get tickets by event ID
  const getTicketsByEvent = (eventId) => {
    if (!eventId || !userTickets.length) return [];
    return userTickets.filter(ticket => parseInt(ticket.eventId) === parseInt(eventId));
  };

  // Check in an attendee (for organizers)
  const checkInAttendee = async (attendeeId, checkInStatus) => {
    if (!isAuthenticated()) {
      toast.error('Please log in to perform check-in');
      return null;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/ticket/check-in/${attendeeId}`,
        { check_in_status: checkInStatus },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
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