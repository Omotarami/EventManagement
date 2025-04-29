import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch user tickets when the component mounts or when user authentication changes
  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchUserTickets();
    } else {
      // Clear tickets if user is not authenticated
      setTickets([]);
    }
  }, [user, isAuthenticated]);

  // Fetch all tickets for the current user
  const fetchUserTickets = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/ticket/user/${user.id}`);
      
      if (response.data && response.data.data) {
        setTickets(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching user tickets:', err);
      setError(err.response?.data?.message || 'Failed to fetch tickets');
      
      // Try to get tickets from localStorage as fallback (for demo purposes)
      const storedTickets = localStorage.getItem('userTickets');
      if (storedTickets) {
        try {
          setTickets(JSON.parse(storedTickets));
        } catch (e) {
          console.error('Error parsing stored tickets:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Purchase a ticket for an event
  const purchaseTicket = async (eventId, ticketId, quantity = 1) => {
    if (!user) {
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
        // Refresh the tickets after purchase
        await fetchUserTickets();
        
        toast.success('Ticket purchased successfully!');
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      const errorMessage = err.response?.data?.message || 'Failed to purchase ticket';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get tickets for a specific event
  const getEventTickets = async (eventId) => {
    try {
      const response = await api.get(`/ticket/event/${eventId}`);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error('Error fetching event tickets:', err);
      return [];
    }
  };

  // Get attendees for a specific event
  const getEventAttendees = async (eventId) => {
    try {
      const response = await api.get(`/ticket/attendees/${eventId}`);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error('Error fetching event attendees:', err);
      return [];
    }
  };

  // Check if user has a ticket for a specific event
  const hasTicketForEvent = (eventId) => {
    if (!eventId || !tickets.length) return false;
    
    return tickets.some(ticket => 
      ticket.eventId === eventId || 
      ticket.eventId === parseInt(eventId)
    );
  };

  // Get tickets for a specific event
  const getTicketsByEvent = (eventId) => {
    if (!eventId || !tickets.length) return [];
    
    return tickets.filter(ticket => 
      ticket.eventId === eventId || 
      ticket.eventId === parseInt(eventId)
    );
  };

  // Calculate total revenue for event (for organizers)
  const calculateEventRevenue = (eventId) => {
    if (!eventId) return 0;
    
    return tickets
      .filter(ticket => 
        (ticket.eventId === eventId || ticket.eventId === parseInt(eventId))
      )
      .reduce((sum, ticket) => sum + (ticket.totalAmount || 0), 0);
  };

  // Check in an attendee (for organizers)
  const checkInAttendee = async (attendeeId, checkIn = true) => {
    try {
      const response = await api.post(`/ticket/check-in/${attendeeId}`, {
        check_in: checkIn
      });
      
      if (response.data && response.data.data) {
        toast.success(checkIn ? 'Attendee checked in successfully!' : 'Attendee check-in reverted');
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error checking in attendee:', err);
      toast.error(err.response?.data?.message || 'Failed to update check-in status');
      return null;
    }
  };

  // Get user tickets (convenience function)
  const getUserTickets = () => {
    return tickets;
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      loading,
      error,
      fetchUserTickets,
      purchaseTicket,
      getEventTickets,
      getEventAttendees,
      hasTicketForEvent,
      getTicketsByEvent,
      calculateEventRevenue,
      checkInAttendee,
      getUserTickets
    }}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use the ticket context
export const useTickets = () => {
  const context = useContext(TicketContext);
  
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  
  return context;
};

export default TicketProvider;