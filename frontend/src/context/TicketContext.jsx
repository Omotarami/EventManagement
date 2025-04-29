/* eslint-disable no-undef */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

// Mock data for tickets
const MOCK_TICKETS = [
  {
    id: 'ticket-1',
    orderId: 'ORD-123456',
    eventId: '1',
    eventTitle: 'Tech Conference 2025',
    eventDate: '2025-05-15T10:00:00Z',
    eventTime: '10:00 AM',
    eventLocation: 'Convention Center',
    eventImage: 'https://via.placeholder.com/300',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    ticketType: 'VIP Pass',
    price: 99.99,
    quantity: 1,
    totalAmount: 99.99,
    purchaseDate: '2025-04-01T14:30:00Z',
    checkInStatus: 'not-checked-in'
  },
  {
    id: 'ticket-2',
    orderId: 'ORD-234567',
    eventId: '2',
    eventTitle: 'Music Festival',
    eventDate: '2025-06-20T18:00:00Z',
    eventTime: '6:00 PM',
    eventLocation: 'City Park',
    eventImage: 'https://via.placeholder.com/300',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    ticketType: 'General Admission',
    price: 79.99,
    quantity: 2,
    totalAmount: 159.98,
    purchaseDate: '2025-04-05T09:15:00Z',
    checkInStatus: 'not-checked-in'
  },
  {
    id: 'ticket-3',
    orderId: 'ORD-345678',
    eventId: '3',
    eventTitle: 'Business Workshop',
    eventDate: '2025-05-10T09:00:00Z',
    eventTime: '9:00 AM',
    eventLocation: 'Downtown Hotel',
    eventImage: 'https://via.placeholder.com/300',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    ticketType: 'Early Bird',
    price: 49.99,
    quantity: 1,
    totalAmount: 49.99,
    purchaseDate: '2025-03-20T11:45:00Z',
    checkInStatus: 'checked-in'
  }
];

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, initialized } = useAuth();

  // Initialize tickets from localStorage or mock data
  useEffect(() => {
    if (initialized && isAuthenticated() && user) {
      fetchUserTickets();
    }
  }, [initialized, user, isAuthenticated]);

  // Fetch user's tickets (from localStorage or mock data)
  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      
      // First try to get tickets from localStorage
      const storedTickets = localStorage.getItem('userTickets');
      
      if (storedTickets) {
        // If we have stored tickets, use those
        setTickets(JSON.parse(storedTickets));
      } else {
        // Otherwise, use the mock data (first time initialization)
        setTickets(MOCK_TICKETS);
        // Store in localStorage for future use
        localStorage.setItem('userTickets', JSON.stringify(MOCK_TICKETS));
      }
      
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Failed to load tickets');
      toast.error('Unable to load your tickets');
    } finally {
      setLoading(false);
    }
  };

  // Purchase a ticket
  const purchaseTicket = async (event, ticketType, quantity) => {
    if (!isAuthenticated()) {
      toast.error('Please log in to purchase tickets');
      throw new Error('Authentication required');
    }

    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Find the selected ticket from event tickets
      const selectedTicket = event.tickets?.find(t => t.name === ticketType) || {
        name: ticketType || 'General Admission',
        price: event.price || 0
      };
      
      // Create a new ticket
      const newTicket = {
        id: 'ticket-' + uuidv4().slice(0, 8),
        orderId: 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate || new Date().toISOString(),
        eventTime: event.startTime || '19:00',
        eventLocation: event.location || 'Venue',
        eventImage: event.imageSrc || 'https://via.placeholder.com/300',
        userId: user.id,
        userName: user.name || 'Guest User',
        userEmail: user.email || 'guest@example.com',
        ticketType: selectedTicket.name,
        price: selectedTicket.price,
        quantity: quantity,
        totalAmount: selectedTicket.price * quantity,
        purchaseDate: new Date().toISOString(),
        checkInStatus: 'not-checked-in'
      };
      
      // Add the new ticket to the state and localStorage
      const updatedTickets = [...tickets, newTicket];
      setTickets(updatedTickets);
      localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
      
      toast.success('Ticket purchased successfully!');
      return newTicket;
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      toast.error('Failed to purchase ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a ticket for a specific event
  const hasTicketForEvent = (eventId) => {
    if (!eventId || !tickets || !tickets.length) return false;
    return tickets.some(ticket => 
      ticket.eventId === eventId || 
      ticket.eventId === parseInt(eventId) ||
      ticket.eventId === String(eventId)
    );
  };

  // Get all tickets for a specific event
  const getTicketsForEvent = (eventId) => {
    if (!eventId || !tickets || !tickets.length) return [];
    return tickets.filter(ticket => 
      ticket.eventId === eventId || 
      ticket.eventId === parseInt(eventId) ||
      ticket.eventId === String(eventId)
    );
  };

  // Calculate event revenue
  const calculateEventRevenue = (eventId) => {
    if (!eventId || !tickets || !tickets.length) return 0;
    
    const eventTickets = getTicketsForEvent(eventId);
    return eventTickets.reduce((total, ticket) => {
      const amount = parseFloat(ticket.totalAmount || 0);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  // Get tickets by event
  const getTicketsByEvent = (eventId) => {
    return getTicketsForEvent(eventId);
  };

  // Check in a ticket
  const checkInTicket = (ticketId) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, checkInStatus: 'checked-in' } : ticket
    );
    
    setTickets(updatedTickets);
    localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
    
    toast.success('Ticket checked in successfully!');
    return updatedTickets.find(ticket => ticket.id === ticketId);
  };

  // Cancel a ticket
  const cancelTicket = (ticketId) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
    
    setTickets(updatedTickets);
    localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
    
    toast.success('Ticket cancelled successfully!');
    return true;
  };

  // Get all tickets
  const getUserTickets = () => {
    return tickets || [];
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      loading,
      error,
      purchaseTicket,
      getUserTickets,
      hasTicketForEvent,
      getTicketsForEvent,
      getTicketsByEvent,
      calculateEventRevenue,
      fetchUserTickets,
      checkInTicket,
      cancelTicket
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