/* eslint-disable no-unused-vars */
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
      // For now, mock the data - replace with actual API call later
      // const response = await axios.get(`/api/ticket/user/${userId}`);
      const mockTickets = [
        {
          id: '1',
          eventId: '1',
          eventTitle: 'Tech Conference 2025',
          eventDate: '2025-06-15',
          eventTime: '09:00 AM',
          eventLocation: 'Convention Center',
          ticketType: 'VIP Pass',
          price: 149.99,
          quantity: 1,
          totalAmount: 149.99,
          purchaseDate: '2025-04-01',
          orderId: 'ORD-12345',
          checkInStatus: 'not-checked-in',
          userName: user?.name || 'Guest',
          userEmail: user?.email || 'guest@example.com'
        },
        // Add more mock tickets as needed
      ];
      
      setUserTickets(mockTickets);
      
      // Also store in localStorage for faster access
      localStorage.setItem('userTickets', JSON.stringify(mockTickets));
      
      return mockTickets;
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
      // For development, create mock data
      // const response = await axios.get(`/api/ticket/event/${eventId}`);
      const mockEventTickets = [
        {
          id: '1',
          ticket_name: 'Early Bird',
          ticket_type: 'standard',
          price: 49.99,
          description: 'Limited early access tickets',
          quantity: 100,
          sold: 45
        },
        {
          id: '2',
          ticket_name: 'VIP Access',
          ticket_type: 'vip',
          price: 149.99,
          description: 'Full access including workshops',
          quantity: 50,
          sold: 10
        }
      ];
      
      // Save to state
      setEventTickets(prev => ({
        ...prev,
        [eventId]: mockEventTickets
      }));
      
      return mockEventTickets;
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
      // In development, simulate a successful purchase
      // const response = await axios.post('/api/ticket/purchase', {...});
      
      // Create a mock purchased ticket
      const selectedTicket = eventTickets[eventId]?.find(ticket => ticket.id === ticketId);
      
      if (!selectedTicket) {
        throw new Error('Selected ticket not found');
      }
      
      const purchasedTicket = {
        id: `ticket-${Date.now()}`,
        eventId: eventId,
        eventTitle: 'Event Title', // You'll need to get this from your EventContext
        eventDate: new Date().toISOString(),
        eventTime: '10:00 AM',
        eventLocation: 'Event Location',
        ticketType: selectedTicket.ticket_name,
        price: selectedTicket.price,
        quantity: quantity,
        totalAmount: selectedTicket.price * quantity,
        purchaseDate: new Date().toISOString(),
        orderId: `ORD-${Date.now()}`,
        checkInStatus: 'not-checked-in',
        userName: user?.name || 'Guest',
        userEmail: user?.email || 'guest@example.com'
      };
      
      // Add to user tickets
      const updatedTickets = [...userTickets, purchasedTicket];
      setUserTickets(updatedTickets);
      
      // Update localStorage
      localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
      
      toast.success('Ticket purchased successfully!');
      return purchasedTicket;
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      toast.error(error.message || 'Failed to purchase ticket');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a ticket for a specific event
  const hasTicketForEvent = (eventId) => {
    if (!userTickets || !userTickets.length || !eventId) return false;
    return userTickets.some(ticket => String(ticket.eventId) === String(eventId));
  };

  // Get all tickets purchased by the user - ALWAYS return an array
  const getUserTickets = () => {
    return Array.isArray(userTickets) ? userTickets : [];
  };

  // Calculate event revenue (for organizers)
  const calculateEventRevenue = (eventId) => {
    if (!eventId || !userTickets || !userTickets.length) return 0;
    
    return userTickets
      .filter(ticket => String(ticket.eventId) === String(eventId))
      .reduce((total, ticket) => total + parseFloat(ticket.totalAmount || 0), 0);
  };

  // Get tickets by event ID
  const getTicketsByEvent = (eventId) => {
    if (!eventId || !userTickets || !userTickets.length) return [];
    return userTickets.filter(ticket => String(ticket.eventId) === String(eventId));
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
    getTicketsByEvent
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