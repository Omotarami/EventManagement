/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical } from "lucide-react";
import { ActionButton } from "../EventForm/FormComponents";
import StepNavigation from "../EventForm/StepNavigation";
import TicketForm from "../EventForm/TicketForm";

/**
 * TicketsStep component
 * Second step of the event creation process for adding tickets
 * 
 * @param {Object} props
 * @param {Object} props.formData 
 * @param {Function} props.updateFormData 
 * @param {Function} props.onNext 
 * @param {Function} props.onPrev 
 */
const TicketsStep = ({ formData, updateFormData, onNext, onPrev }) => {
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [editingTicketIndex, setEditingTicketIndex] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  
  const tickets = formData.tickets || [];

  
  const handleAddTicket = () => {
    setIsAddingTicket(true);
    setEditingTicketIndex(null);
  };

 
  const handleSaveTicket = (ticket) => {
    let updatedTickets;
    
    if (editingTicketIndex !== null) {
      // Update existing ticket
      updatedTickets = [...tickets];
      updatedTickets[editingTicketIndex] = {
        ...updatedTickets[editingTicketIndex],
        ...ticket
      };
    } else {
      // Add new ticket
      updatedTickets = [...tickets, { ...ticket, id: Date.now() }];
    }
    
    updateFormData({ tickets: updatedTickets });
    setIsAddingTicket(false);
    setEditingTicketIndex(null);
  };

 
  const handleCancelTicket = () => {
    setIsAddingTicket(false);
    setEditingTicketIndex(null);
  };

  
  const handleEditTicket = (index) => {
    setEditingTicketIndex(index);
    setIsAddingTicket(true);
    setShowActionMenu(null);
  };

  
  const handleDeleteTicket = (index) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    updateFormData({ tickets: updatedTickets });
    setShowActionMenu(null);
  };

  
  const handleCloneTicket = (index) => {
    const ticketToClone = { ...tickets[index], id: Date.now() };
    if (ticketToClone.name) {
      ticketToClone.name = `${ticketToClone.name} (Copy)`;
    }
    updateFormData({ tickets: [...tickets, ticketToClone] });
    setShowActionMenu(null);
  };

  
  const calculateTotalRevenue = (ticket) => {
    if (ticket.type === "free") return 0;
    const price = parseFloat(ticket.price) || 0;
    return price * (ticket.quantity || 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div>
      {/* Header with add ticket button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tickets</h2>
        {!isAddingTicket && (
          <ActionButton
            onClick={handleAddTicket}
            icon={<Plus size={16} />}
            variant="primary"
          >
            Add Tickets
          </ActionButton>
        )}
      </div>

      {/* Ticket form (for adding/editing) */}
      {isAddingTicket && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <TicketForm
            ticket={editingTicketIndex !== null ? tickets[editingTicketIndex] : null}
            onSave={handleSaveTicket}
            onCancel={handleCancelTicket}
          />
        </motion.div>
      )}

      {/* Tickets list */}
      {!isAddingTicket && tickets.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 py-3 px-4 bg-gray-50 rounded-t-lg border-t border-l border-r border-gray-200">
            <div className="font-medium text-gray-700">Ticket Name</div>
            <div className="font-medium text-gray-700 text-center">Tickets Sold</div>
            <div className="font-medium text-gray-700 text-center">Ticket Price</div>
            <div className="font-medium text-gray-700 text-right">Total Revenue</div>
          </div>

          {/* Table rows */}
          <div className="border border-gray-200 rounded-b-lg divide-y divide-gray-200">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id || index}
                variants={itemVariants}
                className="grid grid-cols-4 gap-4 py-4 px-4 items-center"
              >
                {/* Ticket name */}
                <div className="font-medium text-gray-800">
                  {ticket.name || `Ticket ${index + 1}`}
                </div>

                {/* Tickets sold */}
                <div className="text-center text-gray-600">
                  {ticket.sold || 0} / {ticket.quantity || 10}
                </div>

                {/* Ticket price */}
                <div className="text-center text-gray-600">
                  {ticket.type === "free" ? (
                    "Free"
                  ) : (
                    `$${parseFloat(ticket.price || 0).toFixed(2)}`
                  )}
                </div>

                {/* Total revenue */}
                <div className="text-right flex items-center justify-between">
                  <span className="text-gray-800">
                    ${calculateTotalRevenue(ticket).toFixed(2)}
                  </span>

                  {/* Action menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowActionMenu(showActionMenu === index ? null : index)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>

                    {/* Dropdown menu */}
                    <AnimatePresence>
                      {showActionMenu === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32"
                        >
                          <button
                            type="button"
                            onClick={() => handleEditTicket(index)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCloneTicket(index)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowActionMenu(null)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Close Ticket
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTicket(index)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!isAddingTicket && tickets.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mb-8">
          <p className="text-gray-600 mb-3">No tickets added yet</p>
          <p className="text-gray-500 text-sm mb-4">
            Add tickets to your event so attendees can register
          </p>
          <ActionButton
            onClick={handleAddTicket}
            icon={<Plus size={16} />}
            variant="primary"
          >
            Add Your First Ticket
          </ActionButton>
        </div>
      )}

      {/* Navigation buttons */}
      <StepNavigation onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

export default TicketsStep;