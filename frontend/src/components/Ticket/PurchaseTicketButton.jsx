/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, Check, CreditCard, Calendar, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const PurchaseTicketButton = ({ event, buttonStyle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // When the modal opens, prepare the ticket data
  useEffect(() => {
    if (isModalOpen && event) {
      prepareTicketData();
    }
  }, [isModalOpen, event]);
  
  const prepareTicketData = () => {
    setIsLoading(true);
    
    // Create ticket data based on event.tickets or a default ticket
    try {
      setTimeout(() => {
        let availableTickets = [];
        
        // Use event.tickets if available
        if (event.tickets && event.tickets.length > 0) {
          // Use the ticket data directly from the event
          setSelectedTicket(event.tickets[0]);
        } else {
          // Create a default ticket
          const defaultTicket = {
            id: `default-ticket-${Date.now()}`,
            name: "General Admission",
            description: "Standard entry ticket",
            price: event.price || 29.99,
            quantity: 100,
            sold: 0
          };
          
          setSelectedTicket(defaultTicket);
        }
        
        setIsLoading(false);
      }, 500); // Simulated loading delay
    } catch (error) {
      console.error("Error preparing ticket data:", error);
      setIsLoading(false);
      
      // Set a default ticket even if there's an error
      const fallbackTicket = {
        id: `fallback-ticket-${Date.now()}`,
        name: "General Admission",
        description: "Standard entry ticket",
        price: event.price || 29.99,
        quantity: 100,
        sold: 0
      };
      
      setSelectedTicket(fallbackTicket);
    }
  };
  
  const handleClickBuy = () => {
    // Check if user is logged in first
    if (!isAuthenticated()) {
      toast.error('Please log in to purchase tickets');
      navigate('/login');
      return;
    }
    
    setIsModalOpen(true);
  };
  
  const handleClose = () => {
    if (isSuccess) {
      navigate('/tickets');
    } else {
      setIsModalOpen(false);
      setIsProcessing(false);
      setIsSuccess(false);
      setPurchasedTicket(null);
      setSelectedTicket(null);
    }
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) { 
      setQuantity(value);
    }
  };
  
  const handleCompletePurchase = async () => {
    if (!selectedTicket) {
      toast.error('Please select a ticket');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new ticket object
      const newTicket = {
        id: 'ticket-' + uuidv4().slice(0, 8),
        orderId: 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate || new Date().toISOString(),
        eventTime: event.startTime || '19:00',
        eventLocation: event.location || 'Venue',
        eventImage: event.imageSrc || 'https://via.placeholder.com/300',
        userId: user?.id || 'user-1',
        userName: user?.name || 'Guest User',
        userEmail: user?.email || 'guest@example.com',
        ticketType: selectedTicket.name,
        price: selectedTicket.price,
        quantity: quantity,
        totalAmount: selectedTicket.price * quantity,
        purchaseDate: new Date().toISOString(),
        checkInStatus: 'not-checked-in'
      };
      
      // Save ticket to localStorage
      const storedTickets = localStorage.getItem('userTickets');
      const existingTickets = storedTickets ? JSON.parse(storedTickets) : [];
      const updatedTickets = [...existingTickets, newTicket];
      localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
      
      // Update local state with the purchased ticket
      setPurchasedTicket(newTicket);
      setIsSuccess(true);
      
      // Show success notification
      toast.success('Ticket purchased successfully!');
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast.error('Failed to purchase ticket. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getTicketPrice = () => {
    return selectedTicket ? selectedTicket.price : 0;
  };

  const totalAmount = getTicketPrice() * quantity;
  
  return (
    <>
      <button
        onClick={handleClickBuy}
        className={buttonStyle || "w-full text-center py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex items-center justify-center"}
      >
        <Ticket size={16} className="mr-2" />
        Buy Ticket
      </button>
      
      {/* Checkout Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isSuccess ? 'Ticket Confirmation' : 'Purchase Ticket'}
                </h3>
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Success View */}
              {isSuccess ? (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check size={32} className="text-green-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-1">Purchase Complete!</h4>
                    <p className="text-gray-600">Your ticket has been confirmed</p>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-gray-700 mb-3">Order Summary</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Event:</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ticket Type:</span>
                        <span>{purchasedTicket?.ticketType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span>{purchasedTicket?.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span>{purchasedTicket?.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold">${purchasedTicket?.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    A receipt has been sent to your email.
                  </p>
                  
                  <button
                    onClick={() => navigate('/tickets')}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                  >
                    View My Tickets
                  </button>
                </div>
              ) : (
                <>
                  {/* Event Details */}
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      {event.imageSrc ? (
                        <img 
                          src={event.imageSrc} 
                          alt={event.title} 
                          className="w-16 h-16 object-cover rounded mr-4" 
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                          <Calendar size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-500">
                          {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'Date TBD'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Ticket Options */}
                    {isLoading ? (
                      <div className="mb-4 p-6 flex justify-center items-center">
                        <Loader size={24} className="animate-spin text-orange-500 mr-2" />
                        <span className="text-gray-600">Loading ticket options...</span>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ticket Type
                          </label>
                          
                          {event.tickets && event.tickets.length > 0 ? (
                            <div className="space-y-2">
                              {event.tickets.map((ticket) => (
                                <div
                                  key={ticket.id || ticket.name}
                                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                    selectedTicket && selectedTicket.name === ticket.name
                                      ? 'border-orange-500 bg-orange-50' 
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => setSelectedTicket(ticket)}
                                >
                                  <div className="flex justify-between">
                                    <div>
                                      <h5 className="font-medium text-gray-800">{ticket.name}</h5>
                                      {ticket.description && (
                                        <p className="text-xs text-gray-500">{ticket.description}</p>
                                      )}
                                    </div>
                                    <span className="font-semibold">${ticket.price}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className="p-3 border rounded-md border-orange-500 bg-orange-50"
                            >
                              <div className="flex justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-800">
                                    {selectedTicket?.name || "General Admission"}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    Standard entry ticket for this event
                                  </p>
                                </div>
                                <span className="font-semibold">
                                  ${selectedTicket?.price || event.price || 29.99}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Quantity Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <select
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="block w-full p-2 border border-gray-300 rounded-md"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Order Summary</h5>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>
                              {selectedTicket?.name || "General Admission"} x {quantity}
                            </span>
                            <span>${(selectedTicket?.price || event.price || 29.99) * quantity}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {/* Payment Details */}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Payment Method</h5>
                          <div className="p-3 border border-gray-200 rounded-md bg-white flex items-center">
                            <CreditCard size={20} className="text-gray-400 mr-2" />
                            <span>Credit Card (Simulated)</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            This is a mock implementation. No real payment will be processed.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleCompletePurchase}
                      disabled={isProcessing || isLoading}
                      className={`w-full py-2 text-white rounded-md transition-colors ${
                        isProcessing || isLoading
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <Loader size={16} className="animate-spin mr-2" />
                          Processing...
                        </span>
                      ) : (
                        'Complete Purchase'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PurchaseTicketButton;