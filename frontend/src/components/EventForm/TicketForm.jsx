/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { FormInput, FormTextArea, ActionButton, ToggleButton } from "../EventForm/FormComponents";

/**
 * TicketForm component
 * Form for adding or editing a ticket
 * 
 * @param {Object} props
 * @param {Object} props.ticket 
 * @param {Function} props.onSave 
 * @param {Function} props.onCancel 
 */
const TicketForm = ({ ticket = null, onSave, onCancel }) => {
  // Initialize state from existing ticket or defaults
  const [ticketData, setTicketData] = useState({
    type: "paid",
    name: "",
    price: "0.00",
    description: "",
    quantity: "10",
    ...ticket
  });

  
  const ticketTypeOptions = [
    { value: "paid", label: "Paid" },
    { value: "free", label: "Free Tickets" }
  ];

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setTicketData((prev) => ({ 
      ...prev, 
      type: newType,
      
      ...(newType === "free" ? { price: "0.00" } : {})
    }));
  };

  // Format price with decimals
  const formatPrice = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^\d.]/g, "");
    
    // Ensure only one decimal point
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    
    // Format with 2 decimal places if there's a decimal point
    if (parts.length === 2) {
      return parts[0] + "." + parts[1].slice(0, 2);
    }
    
    return numericValue;
  };

  // Handle price change with formatting
  const handlePriceChange = (e) => {
    const formattedPrice = formatPrice(e.target.value);
    setTicketData((prev) => ({ ...prev, price: formattedPrice }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(ticketData);
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
    >
      <h3 className="text-lg font-medium mb-4">
        {ticket ? "Edit Ticket" : "Add New Ticket"}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Ticket Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Ticket Type
          </label>
          <ToggleButton
            name="type"
            value={ticketData.type}
            onChange={handleTypeChange}
            options={ticketTypeOptions}
          />
        </div>

        {/* Ticket Name */}
        <div className="mb-4">
          <FormInput
            id="ticket-name"
            name="name"
            label="Ticket Name"
            placeholder="Enter Ticket Name"
            value={ticketData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Ticket Price (only for paid tickets) */}
        {ticketData.type === "paid" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Price
            </label>
            <div className="relative text-black">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                name="price"
                id="ticket-price"
                value={ticketData.price}
                onChange={handlePriceChange}
                placeholder="0.00"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        {/* Ticket Quantity */}
        <div className="mb-4">
          <FormInput
            id="ticket-quantity"
            name="quantity"
            label="Available Quantity"
            type="number"
            min="1"
            placeholder="Enter number of tickets available"
            value={ticketData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        {/* Ticket Description */}
        <div className="mb-6 text-black">
          <FormTextArea
            id="ticket-description"
            name="description"
            label="Description"
            placeholder="Add details about this ticket type"
            value={ticketData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <ActionButton
            onClick={onCancel}
            variant="secondary"
            type="button"
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="primary"
            type="submit"
          >
            Save Tickets
          </ActionButton>
        </div>
      </form>
    </motion.div>
  );
};

export default TicketForm;