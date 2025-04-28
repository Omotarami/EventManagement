/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Plus, Edit, Trash, User } from "lucide-react";
import { useTickets } from "../../context/TicketContext";
import PurchaseTicketButton from "../Ticket/PurchaseTicketButton";

/**
 * 
 * 
 * 
 * @param {Object} props
 * @param {Object} props.event 
 * @param {string} props.userRole
 */
const EventTickets = ({ event, userRole }) => {
  const { hasTicketForEvent, getUserTickets } = useTickets();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);
  
  
  const userHasTicket = hasTicketForEvent && event?.id ? hasTicketForEvent(event.id) : false;
  const userTicket = getUserTickets ? getUserTickets().find(
    (ticket) => ticket.eventId === event.id
  ) : null;

  // Organizer view for managing tickets
  if (userRole === "organizer") {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Ticket Management
          </h2>
          
          <button 
            className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex items-center"
            onClick={() => {
              setIsEditing(false);
              setEditingTicketId(null);
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Ticket Type
          </button>
        </div>

        {event.tickets && event.tickets.length > 0 ? (
          <div className="space-y-6">
            {/* Ticket Types List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ticket Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sold
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Available
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Revenue
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {event.tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.name}
                        </div>
                        {ticket.description && (
                          <div className="text-sm text-gray-500">
                            {ticket.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${parseFloat(ticket.price).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {ticket.sold || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {(ticket.quantity || 0) - (ticket.sold || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          $
                          {(
                            (ticket.sold || 0) *
                            parseFloat(ticket.price || 0)
                          ).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800" 
                            onClick={() => {
                              setIsEditing(true);
                              setEditingTicketId(index);
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800">
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ticket Settings */}
            <div className="mt-8 space-x-4">
              <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                Update Ticket Prices
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Adjust Ticket Availability
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
            <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Tickets Created
            </h3>
            <p className="text-gray-500 mb-4">
              Define ticket types for your event to start selling
            </p>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Create Tickets
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Attendee view for purchasing tickets
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Available Tickets
      </h2>

      {/* If user already has a ticket */}
      {userHasTicket && userTicket && (
        <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Ticket size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">You have a ticket for this event</p>
              <p className="text-sm text-gray-600">
                {userTicket.ticketType} • ${userTicket.price.toFixed(2)} • Order ID: {userTicket.orderId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List for purchase */}
      {event.tickets && event.tickets.length > 0 ? (
        <div className="space-y-4">
          {event.tickets.map((ticket, index) => {
            const isAvailable = 
              ticket.quantity === undefined || 
              (ticket.quantity - (ticket.sold || 0)) > 0;
              
            return (
              <div 
                key={index}
                className={`border rounded-lg p-4 ${
                  isAvailable 
                    ? 'border-gray-200 hover:border-orange-300 transition-colors' 
                    : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{ticket.name}</h3>
                    {ticket.description && (
                      <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                    )}
                    
                    {/* Sale details */}
                    <div className="text-sm mt-2">
                      {isAvailable ? (
                        <span className="text-green-600">
                          {ticket.quantity ? `${ticket.quantity - (ticket.sold || 0)} remaining` : 'Available'}
                        </span>
                      ) : (
                        <span className="text-red-600">Sold Out</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-semibold text-gray-800">
                      ${parseFloat(ticket.price).toFixed(2)}
                    </div>
                    
                    {/* Purchase Button */}
                    {isAvailable && !userHasTicket && (
                      <div className="mt-2">
                        <PurchaseTicketButton
                          event={{...event, selectedTicket: ticket.name}}
                          buttonStyle="px-4 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Attendees count */}
          {event.soldTickets > 0 && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <User size={16} className="mr-2" />
              <span>{event.soldTickets} people are attending this event</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
          <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Tickets Available Yet
          </h3>
          <p className="text-gray-500">
            The organizer hasn't set up tickets for this event yet.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default EventTickets;