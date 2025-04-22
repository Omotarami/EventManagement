/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import { DollarSign, Users, Ticket, ArrowUpRight, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventRevenueSection = ({ eventId, event }) => {
  const { getTicketsByEvent, calculateEventRevenue } = useTickets();
  const [isExpanded, setIsExpanded] = useState(false);
  

  const tickets = getTicketsByEvent(eventId);
  const totalRevenue = calculateEventRevenue(eventId);
  const ticketsSold = tickets.length;
  
  
  const ticketTypeBreakdown = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.ticketType]) {
      acc[ticket.ticketType] = {
        count: 0,
        revenue: 0,
        price: ticket.price 
      };
    }
    
    acc[ticket.ticketType].count += ticket.quantity;
    acc[ticket.ticketType].revenue += ticket.totalAmount;
    
    return acc;
  }, {});
  
  //Mikey this one suppose come from backend
  const revenueByDay = tickets.reduce((acc, ticket) => {
    const date = new Date(ticket.purchaseDate).toLocaleDateString();
    
    if (!acc[date]) {
      acc[date] = 0;
    }
    
    acc[date] += ticket.totalAmount;
    return acc;
  }, {});
  
  
  const attendees = tickets.map(ticket => ({
    name: ticket.userName,
    email: ticket.userEmail,
    ticketType: ticket.ticketType,
    purchaseDate: ticket.purchaseDate,
    amount: ticket.totalAmount,
    orderId: ticket.orderId
  }));
  

  const exportData = () => {
    const headers = ['Name', 'Email', 'Ticket Type', 'Purchase Date', 'Amount', 'Order ID'];
    
    const csvContent = [
      headers.join(','),
      ...attendees.map(attendee => 
        [
          attendee.name,
          attendee.email,
          attendee.ticketType,
          new Date(attendee.purchaseDate).toLocaleDateString(),
          attendee.amount,
          attendee.orderId
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title}-attendees.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Revenue & Tickets</h2>
        
        <button 
          onClick={exportData}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
        >
          <Download size={16} className="mr-1" />
          Export Data
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-white rounded-lg mr-3">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <h3 className="text-gray-700 font-medium">Total Revenue</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</span>
            {totalRevenue > 0 && (
              <span className="ml-2 text-xs text-green-600 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                +{((ticketsSold / (event.totalTickets || 100)) * 100).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            From {ticketsSold} ticket{ticketsSold !== 1 ? 's' : ''} sold
          </p>
        </div>
        
        {/* Tickets Sold */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-white rounded-lg mr-3">
              <Ticket size={20} className="text-blue-600" />
            </div>
            <h3 className="text-gray-700 font-medium">Tickets Sold</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-800">{ticketsSold}</span>
            <span className="ml-2 text-xs text-gray-600">
              of {event.totalTickets || 'unlimited'}
            </span>
          </div>
          <div className="mt-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${event.totalTickets ? (ticketsSold / event.totalTickets) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        
        {/* Attendees */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-white rounded-lg mr-3">
              <Users size={20} className="text-purple-600" />
            </div>
            <h3 className="text-gray-700 font-medium">Attendees</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-800">{attendees.length}</span>
            <span className="ml-2 text-xs text-gray-600">
              registered
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {tickets.filter(t => t.checkInStatus === 'checked-in').length} checked in so far
          </p>
        </div>
      </div>
      
      {/* Show more/less button */}
      <div className="text-center">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center mx-auto text-sm text-orange-500 hover:text-orange-600"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} className="mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" />
              Show More Details
            </>
          )}
        </button>
      </div>
      
      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-4 border-t border-gray-200">
              {/* Ticket Type Breakdown */}
              <h3 className="text-md font-semibold text-gray-700 mb-3">Ticket Sales Breakdown</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity Sold
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(ticketTypeBreakdown).map(([type, data]) => (
                      <tr key={type}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${data.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {data.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${data.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Recent Transactions */}
              <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">Recent Purchases</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendees.slice(0, 5).map((attendee, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {attendee.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {attendee.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(attendee.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attendee.ticketType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${attendee.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {attendees.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="text-sm text-orange-500 hover:text-orange-600">
                    View All Attendees
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventRevenueSection;