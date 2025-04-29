/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowRight,
} from "lucide-react";
import { useTickets } from "../../context/TicketContext";
import PurchaseTicketButton from "../Ticket/PurchaseTicketButton";
import { useNavigate } from "react-router-dom";
import EventRevenueSection from "../Ticket/EventRevenueSection";
import { useAuth } from "../../context/AuthContext";

// Safe formatting utilities
const formatDate = (dateString) => {
  if (!dateString) return "TBD";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Function to safely format time objects or strings
const formatTimeValue = (timeValue) => {
  if (typeof timeValue === "string") return timeValue;

  if (timeValue && typeof timeValue === "object") {
    // Handle time objects with time and period properties
    if (timeValue.time && timeValue.period) {
      return `${timeValue.time} ${timeValue.period}`;
    }

    // Try to convert the object to a string representation
    try {
      return JSON.stringify(timeValue);
    } catch (error) {
      console.error("Error stringifying time object:", error);
      return "Invalid Time Format";
    }
  }

  return "TBD";
};

/**
 * Event Overview component
 *
 * @param {Object} props
 * @param {Object} props.event
 * @param {string} props.userRole
 * @param {string} props.eventId
 */
const EventOverview = ({ event, userRole: propUserRole, eventId }) => {
  const navigate = useNavigate();
  const { hasTicketForEvent, getUserTickets } = useTickets();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { user, isAuthenticated, isOrganizer, isAttendee } = useAuth(); // Get authentication info

  // Use the provided userRole prop or determine from auth context
  const userRole =
    propUserRole ||
    (isOrganizer && typeof isOrganizer === "function" && isOrganizer()
      ? "organizer"
      : isAttendee && typeof isAttendee === "function" && isAttendee()
      ? "attendee"
      : null);

  // Add safety check for missing event data
  if (!event) {
    console.error("EventOverview: event object is missing");
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Event data not available
        </h2>
        <p className="text-gray-600">
          The event information could not be loaded.
        </p>
      </div>
    );
  }

  // Check if user has a ticket for this event with extra safety checks
  const userHasTicket =
    hasTicketForEvent && typeof hasTicketForEvent === "function"
      ? hasTicketForEvent(eventId)
      : false;

  // Get user tickets safely
  const userTicketsArray =
    getUserTickets && typeof getUserTickets === "function"
      ? getUserTickets()
      : [];

  // Find the specific ticket with proper type checking
  let userTicket = null;
  if (Array.isArray(userTicketsArray) && userTicketsArray.length > 0) {
    userTicket = userTicketsArray.find(
      (ticket) =>
        ticket && ticket.eventId && String(ticket.eventId) === String(eventId)
    );
  }

  // Calculate ticket sales percentage
  const ticketPercentage =
    event.totalTickets > 0 ? (event.soldTickets / event.totalTickets) * 100 : 0;
  const remainingTickets = event.totalTickets - event.soldTickets;

  // Check if user is authenticated
  const isUserAuthenticated =
    isAuthenticated && typeof isAuthenticated === "function"
      ? isAuthenticated()
      : false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Event Details */}
      <div className="md:col-span-2 space-y-6">
        {/* Event Description Card */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            About This Event
          </h2>

          {/* Description with Show More/Less toggle */}
          <div className="relative">
            <p
              className={`text-gray-600 whitespace-pre-line ${
                !showFullDescription && "line-clamp-4"
              }`}
            >
              {event.description || "No description available for this event."}
            </p>

            {/* Only show toggle button if description is long enough */}
            {event.description && event.description.length > 180 && (
              <button
                className="mt-2 text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    <span>Show More</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Revenue Section for Organizers */}
        {userRole === "organizer" && (
          <EventRevenueSection eventId={eventId} event={event} />
        )}

        {/* Location Card */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>

          {event.eventType === "physical" ? (
            <div>
              <div className="flex items-start">
                <MapPin size={20} className="text-gray-500 mr-3 mt-1" />
                <div>
                  <p className="text-gray-800 font-medium">
                    {event.location || "Location not specified"}
                  </p>
                  {/* Placeholder for Google Maps embedding */}
                  <div className="mt-4 bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">
                      Map preview would appear here
                    </p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      event.location || ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-orange-500 hover:text-orange-600 inline-block"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-gray-600">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg font-semibold">@</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Virtual Event</p>
                <p className="text-sm">
                  {event.location ? (
                    <a
                      href={event.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      Join event
                    </a>
                  ) : (
                    "Meeting link will be provided closer to the event"
                  )}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Agenda Card (if the event has an agenda) */}
        {event.agenda && event.agenda.length > 0 && (
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Event Agenda
            </h2>
            <div className="space-y-4">
              {event.agenda.map((item, index) => (
                <div
                  key={index}
                  className="border-l-2 border-orange-200 pl-4 py-2"
                >
                  <p className="text-sm text-orange-500 font-medium">
                    {formatTimeValue(item.time)}
                  </p>
                  <h3 className="text-base font-medium text-gray-800 mt-1">
                    {item.title || "Untitled Session"}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* For Attendees: Ticket Information (if the user has a ticket) */}
        {userRole === "attendee" && userHasTicket && userTicket && (
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Ticket size={20} className="mr-2 text-green-500" />
              Your Ticket
            </h2>

            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm text-green-600 font-medium">
                    Confirmed
                  </span>
                  <h3 className="font-medium text-gray-800">
                    {userTicket.ticketType || "Standard"}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <div className="font-mono text-sm">
                    {userTicket.orderId || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                <div>
                  <span className="block text-gray-500">Purchase Date:</span>
                  <span>
                    {formatDate(userTicket.purchaseDate || new Date())}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">Quantity:</span>
                  <span>{userTicket.quantity || 1}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Total Price:</span>
                  <span>
                    ${parseFloat(userTicket.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/tickets")}
                className="flex items-center justify-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex-grow"
              >
                <Ticket size={16} className="mr-2" />
                View Ticket
              </button>
              <button
                onClick={() => navigate("/tickets")}
                className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Column - Event Stats and Actions */}
      <div className="space-y-6">
        {/* Tickets Stats Card */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Ticket Availability
          </h2>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{event.soldTickets || 0} sold</span>
              <span className="text-gray-500">
                {event.totalTickets || 0} total
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400"
                style={{ width: `${ticketPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Ticket size={18} className="mr-2" />
                <span>Remaining</span>
              </div>
              <span className="font-medium text-gray-800">
                {remainingTickets}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Users size={18} className="mr-2" />
                <span>Attendees</span>
              </div>
              <span className="font-medium text-gray-800">
                {event.soldTickets || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2" />
                <span>Event Date</span>
              </div>
              <span className="font-medium text-gray-800">
                {formatDate(event.startDate)}
              </span>
            </div>
          </div>

          {/* Purchase Ticket Button - Show for attendees who don't have tickets or non-authenticated users */}
          {((userRole === "attendee" && !userHasTicket) ||
            !isUserAuthenticated) && (
            <div className="mt-4">
              <PurchaseTicketButton
                event={event}
                buttonStyle="w-full text-center py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors flex items-center justify-center"
              />
            </div>
          )}
        </motion.div>

        {/* Quick Actions - Different for each role */}
        {isUserAuthenticated && (
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>

            <div className="space-y-3">
              {/* Organizer Actions */}
              {userRole === "organizer" && (
                <>
                  <button className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center">
                    <Ticket size={18} className="mr-2" />
                    <span>Sell Tickets</span>
                  </button>

                  <button
                    className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    onClick={() =>
                      document.querySelector('[data-tab="attendees"]')?.click()
                    }
                  >
                    <Users size={18} className="mr-2" />
                    <span>Manage Attendees</span>
                  </button>

                  <button className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center">
                    <Download size={18} className="mr-2" />
                    <span>Download Report</span>
                  </button>
                </>
              )}

              {/* Attendee Actions */}
              {userRole === "attendee" && (
                <>
                  {/* If the user has a ticket, show attendee networking */}
                  {userHasTicket ? (
                    <button
                      onClick={() => navigate(`/messages?event=${eventId}`)}
                      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Users size={18} className="mr-2" />
                      <span>Connect with Attendees</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/attendee-dashboard")}
                      className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ArrowRight size={18} className="mr-2" />
                      <span>Explore Other Events</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Event Schedule Card (for recurring events) */}
        {event.isRecurring && event.dates && event.dates.length > 1 && (
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Event Schedule
            </h2>
            <div className="text-gray-600">
              <p>This is a recurring event</p>
              <div className="mt-3 space-y-2">
                {event.dates.map((date, index) => (
                  <div key={index} className="flex items-center">
                    <Calendar size={16} className="mr-2 text-orange-500" />
                    <span>{formatDate(date)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventOverview;
