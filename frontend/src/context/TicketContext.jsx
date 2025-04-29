import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch user tickets when authenticated
  useEffect(() => {
    if (isAuthenticated() && user?.id) {
      fetchUserTickets();
    } else {
      setTickets([]);
    }
  }, [user, isAuthenticated]);

  // Get all tickets for the current user
  const fetchUserTickets = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/ticket/user/${user.id}`);
      
      if (response.data && response.data.data) {
        setTickets(response.data.data);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error('Error fetching user tickets:', err);
      setError(err.response?.data?.error || 'Failed to fetch tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Get tickets for a specific event
  const getEventTickets = async (eventId) => {
    try {
      const response = await api.get(`/ticket/event/${eventId}`);
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching event tickets:', err);
      return [];
    }
  };

  // Purchase a ticket
  const purchaseTicket = async (eventId, ticketId, quantity = 1) => {
    if (!user?.id) {
      toast.error('Please log in to purchase tickets');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/ticket/purchase', {
        event_id: eventId,
        user_id: user.id,
        ticket_id: ticketId,
        quantity
      });
      
      if (response.data && response.data.data) {
        // Refresh user tickets after purchase
        await fetchUserTickets();
        
        toast.success('Ticket purchased successfully!');
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      const errorMessage = err.response?.data?.error || 'Failed to purchase ticket';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get attendees for an event
  const getEventAttendees = async (eventId) => {
    try {
      const response = await api.get(`/ticket/attendees/${eventId}`);
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching event attendees:', err);
      return [];
    }
  };

  // Check in an attendee
  const checkInAttendee = async (attendeeId, checkIn = true) => {
    try {
      const response = await api.post(`/ticket/check-in/${attendeeId}`, {
        check_in: checkIn
      });
      
      if (response.data && response.data.data) {
        toast.success(checkIn ? 'Attendee checked in successfully!' : 'Check-in reverted');
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error checking in attendee:', err);
      toast.error(err.response?.data?.error || 'Failed to update check-in status');
      return null;
    }
  };

  // Check if user has tickets for an event
  const hasTicketForEvent = (eventId) => {
    if (!eventId || !tickets.length) return false;
    
    return tickets.some(ticket => 
      ticket.eventId === eventId || 
      ticket.eventId === parseInt(eventId)
    );
  };

  // Get user tickets for a specific event
  const getTicketsByEvent = (eventId) => {
    if (!eventId || !tickets.length) return [];
    
    return tickets.filter(ticket => 
      ticket.eventId === eventId || 
      ticket.eventId === parseInt(eventId)
    );
  };

  // Calculate total revenue for an event (organizer view)
  const calculateEventRevenue = (eventId) => {
    const eventTickets = getTicketsByEvent(eventId);
    
    return eventTickets.reduce((total, ticket) => 
      total + (ticket.totalAmount || 0), 0
    );
  };

  // Get all user tickets
  const getUserTickets = () => tickets;

  return (
    <TicketContext.Provider value={{
      tickets,
      loading,
      error,
      fetchUserTickets,
      purchaseTicket,
      getEventTickets,
      getEventAttendees,
      checkInAttendee,
      hasTicketForEvent,
      getTicketsByEvent,
      calculateEventRevenue,
      getUserTickets
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);

export default TicketProvider;