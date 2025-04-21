/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Check, Download, ArrowRight, BarChart4 } from 'lucide-react';
import { QRCode } from 'qrcode.react';

const TicketReceiptCard = ({ ticket, showActions = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  
  const handleDownload = (e) => {
    e.stopPropagation();
    
    
    const ticketContent = `
      Event: ${ticket.eventTitle}
      Date: ${formatDate(ticket.eventDate)}
      Ticket Type: ${ticket.ticketType}
      Order ID: ${ticket.orderId}
      Attendee: ${ticket.userName}
    `;
    
    // Create a Blob with the content
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="my-4">
      <motion.div
        className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer perspective"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d', minHeight: '180px' }}
      >
        <motion.div
          className="absolute inset-0 backface-hidden"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Front of the ticket */}
          <div className="p-4 grid grid-cols-3 gap-4 h-full">
            {/* Left part - Event image */}
            <div className="col-span-1">
              {ticket.eventImage ? (
                <img 
                  src={ticket.eventImage} 
                  alt={ticket.eventTitle} 
                  className="w-full h-32 object-cover rounded-md" 
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <Calendar size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Middle part - Event details */}
            <div className="col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">{ticket.eventTitle}</h3>
                
                <div className="mb-1 text-sm text-gray-600 flex items-center">
                  <Calendar size={14} className="mr-1 flex-shrink-0" />
                  <span>{formatDate(ticket.eventDate)}</span>
                </div>
                
                <div className="mb-1 text-sm text-gray-600 flex items-center">
                  <Clock size={14} className="mr-1 flex-shrink-0" />
                  <span>Event Time</span>
                </div>
                
                <div className="text-sm text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{ticket.eventLocation || 'Online Event'}</span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.checkInStatus === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.checkInStatus === 'checked-in' ? (
                      <>
                        <Check size={12} className="mr-1" />
                        Checked In
                      </>
                    ) : (
                      'Not Checked In'
                    )}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  {ticket.ticketType}
                </div>
              </div>
            </div>
          </div>
          
          {/* Flip instructions */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center">
            <span>Flip for details</span>
            <ArrowRight size={10} className="ml-1" />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 backface-hidden"
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.5 }}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Back of the ticket with QR code and details */}
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">Ticket #{ticket.id.slice(-4)}</h3>
                <p className="text-xs text-gray-500">Order: {ticket.orderId}</p>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-gray-800">${ticket.totalAmount.toFixed(2)}</div>
                <p className="text-xs text-gray-500">
                  {ticket.quantity} x ${ticket.price.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between flex-grow">
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-500">Purchased:</span>
                  <div>{new Date(ticket.purchaseDate).toLocaleDateString()}</div>
                </div>
                
                <div>
                  <span className="text-gray-500">Attendee:</span>
                  <div>{ticket.userName}</div>
                </div>
                
                <div>
                  <span className="text-gray-500">Ticket Type:</span>
                  <div>{ticket.ticketType}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="bg-white p-1 rounded-lg">
                  <QRCode 
                    value={`TICKET:${ticket.id}|EVENT:${ticket.eventId}|USER:${ticket.userId}`} 
                    size={80}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            {showActions && (
              <div className="mt-3 flex justify-between">
                <button 
                  onClick={(e) => handleDownload(e)}
                  className="text-sm flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/event-details/${ticket.eventId}`, '_blank');
                  }}
                  className="text-sm flex items-center text-orange-500 hover:text-orange-600"
                >
                  Event Details
                  <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TicketReceiptCard;