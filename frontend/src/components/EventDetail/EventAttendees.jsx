/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Check, X, Download, MessageCircle, Mail, UserPlus, User } from "lucide-react";
import { useTickets } from "../../context/TicketContext";
import { useAuth } from "../../context/AuthContext";

/**
 * 
 * 
 * 
 * @param {Object} props
 * @param {string} props.eventId 
 * @param {string} props.userRole 
 */
const EventAttendees = ({ eventId, userRole }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTicketsByEvent } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  
  const tickets = getTicketsByEvent(eventId);
  
  const [attendees, setAttendees] = useState([]);
  

  useEffect(() => {
    // Map tickets to attendees
    const eventAttendees = tickets.map(ticket => ({
      id: ticket.userId,
      name: ticket.userName,
      email: ticket.userEmail,
      phone: "",
      ticketType: ticket.ticketType,
      ticketPrice: ticket.price,
      purchaseDate: ticket.purchaseDate,
      checkInStatus: ticket.checkInStatus || "not-checked-in",
      orderId: ticket.orderId,
    }));
    

    const mockData = [
      {
        id: "att-001",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        ticketType: "VIP Pass",
        ticketPrice: 149.99,
        purchaseDate: "2025-04-10T10:30:00",
        checkInStatus: "checked-in",
        orderId: "ORD-12345",
        checkinTime: "10:15 AM, April 18, 2025",
      },
      {
        id: "att-002",
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        phone: "+1 (555) 987-6543",
        ticketType: "Standard",
        ticketPrice: 79.99,
        purchaseDate: "2025-04-12T14:45:00",
        checkInStatus: "not-checked-in",
        orderId: "ORD-12346",
      },
    ];
    
    
    setAttendees([...eventAttendees, ...mockData]);
  }, [tickets, eventId]);
  
  // Filter attendees based on search term and filter status
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "checked-in" && attendee.checkInStatus === "checked-in") ||
      (filterStatus === "not-checked-in" && attendee.checkInStatus === "not-checked-in");
    
    return matchesSearch && matchesFilter;
  });
  

  const handleCheckInStatusChange = (attendeeId, newStatus) => {
    setAttendees(prev =>
      prev.map(attendee =>
        attendee.id === attendeeId
          ? {
              ...attendee,
              checkInStatus: newStatus,
              checkinTime: newStatus === "checked-in" ? new Date().toLocaleString() : null
            }
          : attendee
      )
    );
  };
  
  // Handle exporting attendee list (organizer only)
  const handleExportAttendees = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Ticket Type",
      "Purchase Date",
      "Check-in Status",
      "Order ID"
    ];
    
    const csvContent = [
      headers.join(","),
      ...attendees.map(attendee =>
        [
          attendee.name,
          attendee.email,
          attendee.phone || "N/A",
          attendee.ticketType,
          new Date(attendee.purchaseDate).toLocaleDateString(),
          attendee.checkInStatus === "checked-in" ? "Checked In" : "Not Checked In",
          attendee.orderId
        ].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-${eventId}-attendees.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Handle sending message to attendee (works for both roles)
  const handleMessageAttendee = (attendeeId) => {
    // Navigate to messages with this attendee selected
    navigate(`/messages?recipient=${attendeeId}`);
  };
  
  // Organizer view renders a detailed table with actions
  if (userRole === "organizer") {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
              Attendees ({attendees.length})
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search & Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Search attendees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center">
                <Filter size={16} className="text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 px-4 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Attendees</option>
                  <option value="checked-in">Checked In</option>
                  <option value="not-checked-in">Not Checked In</option>
                </select>
              </div>
              
              {/* Export Button */}
              <button
                onClick={handleExportAttendees}
                className="flex items-center justify-center py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
          
          {/* Attendees Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                            <div className="text-sm text-gray-500">{attendee.email}</div>
                            {attendee.phone && (
                              <div className="text-sm text-gray-500">{attendee.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{attendee.ticketType}</div>
                        <div className="text-sm text-gray-500">${attendee.ticketPrice.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(attendee.purchaseDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{attendee.orderId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendee.checkInStatus === "checked-in" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Checked In
                            {attendee.checkinTime && (
                              <span className="ml-1">• {attendee.checkinTime}</span>
                            )}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Not Checked In
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* Check In / Undo Check In */}
                          {attendee.checkInStatus === "checked-in" ? (
                            <button
                              onClick={() => handleCheckInStatusChange(attendee.id, "not-checked-in")}
                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Undo Check In"
                            >
                              <X size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCheckInStatusChange(attendee.id, "checked-in")}
                              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              title="Check In"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          
                          {/* Message Attendee */}
                          <button
                            onClick={() => handleMessageAttendee(attendee.id)}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Message Attendee"
                          >
                            <MessageCircle size={18} />
                          </button>
                          
                          {/* Email Attendee */}
                          <a
                            href={`mailto:${attendee.email}`}
                            className="p-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                            title="Email Attendee"
                          >
                            <Mail size={18} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No attendees found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Attendee view is simpler, showing other attendees they can connect with
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            Connect with Other Attendees
          </h2>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Attendees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees
            .filter(attendee => attendee.id !== user?.id) // Filter out current user
            .map((attendee) => (
              <div
                key={attendee.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-md font-medium text-gray-800">{attendee.name}</h3>
                    <p className="text-sm text-gray-500">{attendee.ticketType}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleMessageAttendee(attendee.id)}
                    className="flex-grow py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex items-center justify-center text-sm"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            ))}
            
          {filteredAttendees.filter(attendee => attendee.id !== user?.id).length === 0 && (
            <div className="col-span-full text-center p-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No other attendees found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "No attendees match your search. Try a different search term." 
                  : "You're the only attendee for this event right now."}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventAttendees;