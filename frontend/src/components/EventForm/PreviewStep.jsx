/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Edit, ShoppingCart, Calendar, MapPin, Clock } from "lucide-react";
import StepNavigation from "../EventForm/StepNavigation";

/**
 * PreviewStep component
 * Final step of the event creation process - shows a preview of the event
 * 
 * @param {Object} props
 * @param {Object} props.formData 
 * @param {Function} props.updateFormData 
 * @param {Function} props.onPrev 
 * @param {Function} props.onSubmit 
 */
const PreviewStep = ({ formData, onPrev, onSubmit }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  
  const formatTime = (timeObj) => {
    if (!timeObj || !timeObj.time) return "";
    return `${timeObj.time} ${timeObj.period}`;
  };

 
  const headerImage = formData.images && formData.images.length > 0
    ? formData.images[0].preview || formData.images[0].url
    : null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Event Preview</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8"
      >
        {/* Preview Header with event image */}
        <div className="bg-gray-200 h-64 relative">
          {headerImage ? (
            <img
              src={headerImage}
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-300">
              <span className="text-gray-500">No event image</span>
            </div>
          )}
        </div>
        
        {/* Event content */}
        <div className="p-6">
          {/* Location */}
          {formData.location && (
            <div className="mb-2 flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{formData.location}</span>
            </div>
          )}
          
          {/* Date and time */}
          {formData.dates && formData.dates.length > 0 && (
            <div className="mb-4 flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>
                Date: {formatDate(formData.dates[0])}
                {formData.isRecurring && formData.dates.length > 1 && 
                  ` + ${formData.dates.length - 1} more dates`}
              </span>
              
              {formData.times && formData.times.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <Clock size={16} className="mr-1" />
                  <span>
                    {formatTime(formData.times[0])} - {formatTime({
                      time: formData.times[0].endTime,
                      period: formData.times[0].endPeriod
                    })}
                  </span>
                </>
              )}
            </div>
          )}
          
          {/* Event title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {formData.title || "Untitled Event"}
          </h1>
          
          {/* Event description */}
          <div className="mb-6 prose max-w-none">
            <p className="text-gray-700">
              {formData.description || "No description provided."}
            </p>
          </div>
          
          {/* Event details section */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Event Details
            </h2>
            <div className="border-t border-gray-200 pt-3">
              <p className="text-gray-700">
                {formData.description || "No details provided."}
              </p>
            </div>
          </div>
          
          {/* Event agenda */}
          {formData.agenda && formData.agenda.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Event Agenda
              </h2>
              <div className="border-t border-gray-200 pt-3">
                {formData.agenda.map((item, index) => (
                  <div key={item.id || index} className="mb-4">
                    <h3 className="font-medium text-gray-800">
                      {item.name || `Session ${index + 1}`}
                    </h3>
                    
                    {item.speakers && item.speakers.length > 0 && (
                      <div className="text-gray-600 mt-1">
                        <strong>Speaker:</strong>{" "}
                        {item.speakers.map(s => s.name).join(", ")}
                      </div>
                    )}
                    
                    {item.time && item.time.time && (
                      <div className="text-gray-600 mt-1">
                        <strong>Time:</strong> {formatTime(item.time)}
                      </div>
                    )}
                    
                    {item.description && (
                      <div className="text-gray-700 mt-2">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Tickets preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">TICKETS</h2>
        
        {formData.tickets && formData.tickets.length > 0 ? (
          <div className="space-y-4">
            {formData.tickets.map((ticket, index) => (
              <div
                key={ticket.id || index}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-800">
                    {ticket.name || `Ticket ${index + 1}`}
                  </h3>
                  {ticket.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {ticket.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="font-medium text-gray-800">
                      {ticket.type === "free" ? "Free" : `$${parseFloat(ticket.price || 0).toFixed(2)}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ticket.sold || 0} / {ticket.quantity || 10} sold
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No tickets have been added yet</p>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <StepNavigation 
        onNext={onSubmit} 
        onPrev={onPrev} 
        isLast={true} 
      />
    </div>
  );
};

export default PreviewStep;