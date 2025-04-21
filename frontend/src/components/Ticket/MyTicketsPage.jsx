/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Search, Filter, Calendar, ArrowRight } from 'lucide-react';
import DashboardNavbar from '../DashboardNavbar';
import Sidebar from '../Sidebar';
import { useTickets } from '../../context/TicketContext';
import TicketReceiptCard from '../Ticket/TicketReceiptCard';

const MyTicketsPage = () => {
  const { getUserTickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const allTickets = getUserTickets();
  
 
  const filteredTickets = allTickets.filter(ticket => {
    const matchesSearch = ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'checked-in' && ticket.checkInStatus === 'checked-in') ||
                         (filterStatus === 'not-checked-in' && ticket.checkInStatus === 'not-checked-in');
    
    return matchesSearch && matchesFilter;
  });
  
  
  const currentDate = new Date();
  const upcomingTickets = filteredTickets.filter(ticket => 
    new Date(ticket.eventDate) >= currentDate
  );
  
  const pastTickets = filteredTickets.filter(ticket => 
    new Date(ticket.eventDate) < currentDate
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tickets</h1>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Search by event name or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500 flex items-center">
                  <Filter size={16} className="mr-1" />
                  <span>Status:</span>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md text-sm py-1 px-2"
                >
                  <option value="all">All Tickets</option>
                  <option value="checked-in">Checked In</option>
                  <option value="not-checked-in">Not Checked In</option>
                </select>
              </div>
            </div>
          </div>

          {allTickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Tickets Found</h2>
              <p className="text-gray-500 mb-4">You haven't purchased any tickets yet.</p>
              <button
                onClick={() => window.location.href = '/attendee-dashboard'}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
              >
                Explore Events
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upcoming Events Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar size={20} className="mr-2 text-orange-500" />
                  Upcoming Events ({upcomingTickets.length})
                </h2>
                
                {upcomingTickets.length > 0 ? (
                  <div>
                    {upcomingTickets.map(ticket => (
                      <TicketReceiptCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">No upcoming tickets found.</p>
                  </div>
                )}
              </div>
              
              {/* Past Events Section */}
              {pastTickets.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar size={20} className="mr-2 text-gray-500" />
                    Past Events ({pastTickets.length})
                  </h2>
                  
                  <div>
                    {pastTickets.map(ticket => (
                      <TicketReceiptCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;