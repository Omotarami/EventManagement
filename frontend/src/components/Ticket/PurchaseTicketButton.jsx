/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, Check, CreditCard, Calendar, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';

const PurchaseTicketButton = ({ event, buttonStyle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState(null);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const { purchaseTicket, getEventTickets } = useTickets();
  const navigate = useNavigate();
  
  // Load tickets when modal opens
  useEffect(() => {
    if (isModalOpen && event?.id) {
      loadEventTickets();
    }
  }, [isModalOpen, event?.id]);
  
  // Load tickets from the backend
  const loadEventTickets = async () => {
    setIsLoading(true);
    
    try {
      const tickets = await getEventTickets(event.id);
      
      if (tickets && tickets.length > 0) {
        setAvailableTickets(tickets);
        setSelectedTicketId(tickets[0].id);
      } else {
        toast.error('No tickets available for this event');
        setAvailableTickets([]);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Failed to load ticket information');
      setAvailableTickets([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClickBuy = () => {
    // Check if user is logged in
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
      setSelectedTicketId(null);
    }
  };
  
  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) { 
      setQuantity(value);
    }
  };
  
  const handleCompletePurchase = async () => {
    if (!selectedTicketId) {
      toast.error('Please select a ticket');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Call the purchaseTicket method from context
      const ticket = await purchaseTicket(event.id, selectedTicketId, quantity);
      
      if (ticket) {
        setPurchasedTicket(ticket);
        setIsSuccess(true);
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast.error('Failed to purchase ticket');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get selected ticket details
  const getSelectedTicket = () => {
    return availableTickets.find(ticket => ticket.id === selectedTicketId);
  };
  
  // Calculate total amount
  const calculateTotalAmount = () => {
    const selectedTicket = getSelectedTicket();
    return selectedTicket ? selectedTicket.price * quantity : 0;
  };
  
  const totalAmount = calculateTotalAmount();
  
  // Check if selected ticket is sold out
  const isSelectedTicketSoldOut = () => {
    const selectedTicket = getSelectedTicket();
    if (!selectedTicket) return false;
    
    return selectedTicket.quantity !== null && 
           selectedTicket.sold >= selectedTicket.quantity;
  };
  
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
                        <span>{purchasedTicket?.ticket_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span>{purchasedTicket?.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span>{purchasedTicket?.order_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold">${purchasedTicket?.total_price}</span>
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
                      <div className="flex justify-center items-center py-8">
                        <Loader size={24} className="animate-spin text-orange-500 mr-2" />
                        <span>Loading tickets...</span>
                      </div>
                    ) : availableTickets.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No tickets available for this event.</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Ticket Type
                          </label>
                          <div className="space-y-2">
                            {availableTickets.map((ticket) => {
                              // Calculate available tickets
                              const available = ticket.quantity !== null 
                                ? ticket.quantity - ticket.sold 
                                : 'Unlimited';
                              
                              // Check if sold out
                              const isSoldOut = ticket.quantity !== null && ticket.sold >= ticket.quantity;
                              
                              return (
                                <div
                                  key={ticket.id}
                                  className={`p-3 border rounded-md ${isSoldOut ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} transition-colors ${
                                    selectedTicketId === ticket.id 
                                      ? 'border-orange-500 bg-orange-50' 
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => !isSoldOut && handleSelectTicket(ticket.id)}
                                >
                                  <div className="flex justify-between">
                                    <div>
                                      <h5 className="font-medium text-gray-800">{ticket.ticket_name}</h5>
                                      {ticket.description && (
                                        <p className="text-xs text-gray-500">{ticket.description}</p>
                                      )}
                                      <p className="text-xs text-gray-500 mt-1">
                                        {isSoldOut ? (
                                          <span className="text-red-500">Sold Out</span>
                                        ) : (
                                          <>Available: {available}</>
                                        )}
                                      </p>
                                    </div>
                                    <span className="font-semibold">${ticket.price}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Quantity Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2 ">
                            Quantity
                          </label>
                          <select
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="block w-full p-2 border border-gray-300 rounded-md text-gray-600"
                            disabled={isSelectedTicketSoldOut()}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-gray-600">
                          <h5 className="font-medium text-gray-700 mb-2">Order Summary</h5>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>
                              {getSelectedTicket()?.ticket_name || 'Selected Ticket'} x {quantity}
                            </span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 mt-2 text-gray-600">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {/* Payment Details */}
                        <div className="mb-4 text-gray-600">
                          <h5 className="font-medium text-gray-700 mb-2">Payment Method</h5>
                          <div className="p-3 border border-gray-200 rounded-md bg-white flex items-center">
                            <CreditCard size={20} className="text-gray-400 mr-2" />
                            <span>Credit Card</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleCompletePurchase}
                      disabled={isProcessing || isLoading || availableTickets.length === 0 || isSelectedTicketSoldOut()}
                      className={`w-full py-2 text-white rounded-md transition-colors ${
                        isProcessing || isLoading || availableTickets.length === 0 || isSelectedTicketSoldOut()
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