import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid'; 


export const TicketContext = createContext();


export const useTickets = () => {
  return useContext(TicketContext);
};

const TicketProvider = ({ children }) => {
  const { user } = useAuth();
  
  
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('userTickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });


  useEffect(() => {
    localStorage.setItem('userTickets', JSON.stringify(tickets));
  }, [tickets]);


  const purchaseTicket = (event, ticketType, quantity = 1) => {

    const ticketId = uuidv4();
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    
  
    const selectedTicketType = event.tickets?.find(t => t.name === ticketType) || { price: event.price || 0 };
    
  
    const purchaseDate = new Date().toISOString();
    
  
    const newTicket = {
      id: ticketId,
      eventId: event.id,
      eventTitle: event.title,
      ticketType: ticketType,
      price: selectedTicketType.price,
      quantity: quantity,
      totalAmount: selectedTicketType.price * quantity,
      purchaseDate: purchaseDate,
      orderId: orderId,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      status: 'confirmed',
      checkInStatus: 'not-checked-in',
      eventImage: event.imageSrc,
      eventDate: event.startDate,
      eventLocation: event.location,
    };
    
    setTickets(prevTickets => [...prevTickets, newTicket]);
    

    return newTicket;
  };

  
  const getUserTickets = () => {
    return tickets.filter(ticket => ticket.userId === user?.id);
  };


  const getTicketById = (ticketId) => {
    return tickets.find(ticket => ticket.id === ticketId);
  };

  
  const hasTicketForEvent = (eventId) => {
    return tickets.some(ticket => 
      ticket.eventId === eventId && ticket.userId === user?.id
    );
  };

 
  const getTicketsByEvent = (eventId) => {
    return tickets.filter(ticket => ticket.eventId === eventId);
  };

  
  const calculateEventRevenue = (eventId) => {
    return tickets
      .filter(ticket => ticket.eventId === eventId)
      .reduce((total, ticket) => total + ticket.totalAmount, 0);
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      purchaseTicket,
      getUserTickets,
      getTicketById,
      hasTicketForEvent,
      getTicketsByEvent,
      calculateEventRevenue
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export default TicketProvider;