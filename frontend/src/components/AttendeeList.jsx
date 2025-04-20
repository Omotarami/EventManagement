/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, Download, ChevronDown, ChevronUp, Mail, Phone, Calendar, Check, X, Clock } from 'lucide-react';

/**
 * 
 * 
 * @param {Object} props
 * @param {Array} props.attendees 
 * @param {string} props.eventId 
 */
const AttendeeList = ({ attendees = [], eventId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); 
  const [sortDirection, setSortDirection] = useState('asc'); 
  const [expandedAttendeeId, setExpandedAttendeeId] = useState(null);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Toggle sort direction or set new sort field
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Toggle expanded attendee details
  const toggleAttendeeDetails = (id) => {
    setExpandedAttendeeId(expandedAttendeeId === id ? null : id);
  };
  
  // Filter attendees based on search term
  const filteredAttendees = attendees.filter(attendee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      attendee.name.toLowerCase().includes(searchLower) ||
      attendee.email.toLowerCase().includes(searchLower) ||
      (attendee.ticketType && attendee.ticketType.toLowerCase().includes(searchLower))
    );
  });
  
  // Sort attendees based on selected field and direction
  const sortedAttendees = [...filteredAttendees].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.purchaseDate) - new Date(b.purchaseDate);
        break;
      case 'status':
        comparison = a.checkInStatus.localeCompare(b.checkInStatus);
        break;
      case 'ticket':
        comparison = a.ticketType.localeCompare(b.ticketType);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case 'checked-in':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} className="mr-1" />
            Checked In
          </span>
        );
      case 'not-checked-in':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Not Checked In
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with title and actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Attendees ({filteredAttendees.length})
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {/* Export Attendee List Button */}
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none">
              <Download size={16} className="mr-2" />
              Export List
            </button>
          </div>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search by name, email or ticket type..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      
      {/* Attendees list */}
      {sortedAttendees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    <span>Attendee</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('ticket')}>
                  <div className="flex items-center">
                    <span>Ticket Type</span>
                    {renderSortIndicator('ticket')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center">
                    <span>Purchase Date</span>
                    {renderSortIndicator('date')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    <span>Status</span>
                    {renderSortIndicator('status')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAttendees.map((attendee) => (
                <React.Fragment key={attendee.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {attendee.profileImage ? (
                            <img className="h-10 w-10 rounded-full" src={attendee.profileImage} alt={attendee.name} />
                          ) : (
                            <span className="text-lg font-medium text-gray-500">
                              {attendee.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                          <div className="text-sm text-gray-500">{attendee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{attendee.ticketType}</div>
                      <div className="text-sm text-gray-500">${attendee.ticketPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(attendee.purchaseDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(attendee.checkInStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => toggleAttendeeDetails(attendee.id)}
                        className="text-orange-500 hover:text-orange-700"
                      >
                        {expandedAttendeeId === attendee.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded details row */}
                  {expandedAttendeeId === attendee.id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail size={16} className="mr-2" />
                                <span>{attendee.email}</span>
                              </div>
                              {attendee.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone size={16} className="mr-2" />
                                  <span>{attendee.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Ticket Information</h3>
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Order ID:</span> {attendee.orderId}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Purchase Date:</span> {formatDate(attendee.purchaseDate)}
                              </div>
                              {attendee.checkinTime && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Check-in Time:</span> {attendee.checkinTime}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-3">
                          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Send Email
                          </button>
                          {attendee.checkInStatus !== 'checked-in' ? (
                            <button className="px-3 py-1 bg-green-600 rounded text-sm font-medium text-white hover:bg-green-700">
                              Check In
                            </button>
                          ) : (
                            <button className="px-3 py-1 bg-yellow-600 rounded text-sm font-medium text-white hover:bg-yellow-700">
                              Undo Check In
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No Attendees Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search term.' : 'There are no attendees for this event yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

AttendeeList.propTypes = {
  attendees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      ticketType: PropTypes.string.isRequired,
      ticketPrice: PropTypes.number.isRequired,
      purchaseDate: PropTypes.string.isRequired,
      checkInStatus: PropTypes.string.isRequired,
      orderId: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
      checkinTime: PropTypes.string
    })
  ),
  eventId: PropTypes.string.isRequired
};

export default AttendeeList;