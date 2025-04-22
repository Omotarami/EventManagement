/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowLeft,
  Edit,
  Share,
  Download,
  Users,
  DollarSign,
  Ticket,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { EventContext } from "../context/EventContext";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import AttendeeList from "../components/AttendeeList";
import { useTickets } from "../context/TicketContext";
import EventRevenueSection from "../components/Ticket/EventRevenueSection";
import PurchaseTicketButton from "../components/Ticket/PurchaseTicketButton";
import TicketReceiptCard from "../components/Ticket/TicketReceiptCard";
import { useAuth } from "../context/AuthContext";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useContext(EventContext);
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { hasTicketForEvent, getTicketsByEvent, getUserTickets } = useTickets();
  const userHasTicket = hasTicketForEvent(eventId);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const userTicket = getUserTickets().find(
    (ticket) => ticket.eventId === eventId
  );
  const attendeeCount = getTicketsByEvent(eventId).length;

  // Mikey Fix here
  const [attendees, setAttendees] = useState([
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
  ]);

  useEffect(() => {
    try {
      if (eventId) {
        console.log("Fetching event with ID:", eventId);
        const eventData = getEventById(eventId);
        console.log("Event data:", eventData);

        if (eventData) {
          setEvent(eventData);
        } else {
          console.error("Event not found with ID:", eventId);
          setError("Event not found");
        }
      } else {
        console.error("No event ID provided");
        setError("No event ID provided");
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [eventId, getEventById]);

  const handleBack = () => {
    navigate("/organizer-dashboard");
  };

  const handleEdit = () => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatTimeValue = (timeValue) => {
    if (!timeValue) return "TBD";

    if (typeof timeValue === "object" && timeValue !== null) {
      if ("time" in timeValue && "period" in timeValue) {
        return `${timeValue.time} ${timeValue.period}`;
      }

      return JSON.stringify(timeValue);
    }

    return timeValue;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Error Loading Event
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Event Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Error formatting date";
    }
  };

  const ticketPercentage =
    event.totalTickets > 0 ? (event.soldTickets / event.totalTickets) * 100 : 0;
  const remainingTickets = event.totalTickets - event.soldTickets;

  const safeEvent = {
    title: event.title || "Untitled Event",
    description: event.description || "No description available.",
    status: event.status || "draft",
    imageSrc: event.imageSrc || "",
    startDate: event.startDate || null,
    endDate: event.endDate || null,
    startTime: formatTimeValue(event.startTime) || "TBD",
    endTime: formatTimeValue(event.endTime) || "TBD",
    category: event.category || "Uncategorized",
    location: event.location || "No location specified",
    eventType: event.eventType || "physical",
    isRecurring: event.isRecurring || false,
    dates: Array.isArray(event.dates) ? event.dates : [],
    agenda: Array.isArray(event.agenda)
      ? event.agenda.map((item) => ({
          ...item,
          time: formatTimeValue(item.time),
        }))
      : [],
    tickets: Array.isArray(event.tickets) ? event.tickets : [],
    totalTickets: event.totalTickets || 0,
    soldTickets: event.soldTickets || 0,
    grossAmount: event.grossAmount || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Dashboard
          </button>

          {/* Event Header */}
          <div className="bg-white rounded-t-xl shadow-sm overflow-hidden">
            {/* Cover Image with Overlay */}
            <div className="relative h-48 md:h-64 bg-gray-200">
              {safeEvent.imageSrc ? (
                <img
                  src={safeEvent.imageSrc}
                  alt={safeEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Calendar size={40} className="text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Event Status Badge */}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {safeEvent.status === "published" && (
                  <span className="text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full inline-block mr-1"></span>
                    Published
                  </span>
                )}
                {safeEvent.status === "draft" && (
                  <span className="text-yellow-600 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full inline-block mr-1"></span>
                    Draft
                  </span>
                )}
                {safeEvent.status === "ended" && (
                  <span className="text-red-600 flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full inline-block mr-1"></span>
                    Ended
                  </span>
                )}
              </div>
            </div>

            {/* Event Title and Action Buttons */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {safeEvent.title}
                  </h1>

                  {/* Event Meta Info */}
                  <div className="mt-2 flex flex-wrap items-center text-gray-600 text-sm">
                    {safeEvent.startDate && (
                      <div className="flex items-center mr-4 mb-2">
                        <Calendar size={16} className="mr-1" />
                        <span>{formatDate(safeEvent.startDate)}</span>
                      </div>
                    )}

                    {safeEvent.startTime && (
                      <div className="flex items-center mr-4 mb-2">
                        <Clock size={16} className="mr-1" />
                        <span>
                          {safeEvent.startTime} - {safeEvent.endTime}
                        </span>
                      </div>
                    )}

                    {safeEvent.category && (
                      <div className="flex items-center mb-2">
                        <Tag size={16} className="mr-1" />
                        <span className="capitalize">{safeEvent.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="mr-1" />
                    <span>Edit</span>
                  </button>

                  <button className="flex items-center px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg transition-colors">
                    <Share size={16} className="mr-1" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow-sm border-b">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "overview"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("overview")}
              >
                Overview
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "attendees"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("attendees")}
              >
                Attendees
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "tickets"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("tickets")}
              >
                Tickets
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
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
                        {safeEvent.description}
                      </p>

                      {/* Only show toggle button if description is long enough */}
                      {safeEvent.description &&
                        safeEvent.description.length > 180 && (
                          <button
                            className="mt-2 text-orange-500 hover:text-orange-600 flex items-center text-sm font-medium"
                            onClick={() =>
                              setShowFullDescription(!showFullDescription)
                            }
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

                  {user?.role === "organizer" && (
                    <EventRevenueSection eventId={eventId} event={event} />
                  )}

                  {/* Location Card */}
                  <motion.div
                    className="bg-white rounded-lg shadow-sm p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Location
                    </h2>

                    {safeEvent.eventType === "physical" ? (
                      <div>
                        <div className="flex items-start">
                          <MapPin
                            size={20}
                            className="text-gray-500 mr-3 mt-1"
                          />
                          <div>
                            <p className="text-gray-800 font-medium">
                              {safeEvent.location}
                            </p>
                            {/* Placeholder for Google Maps embedding */}
                            <div className="mt-4 bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                              <p className="text-gray-500">
                                Map preview would appear here
                              </p>
                            </div>
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(
                                safeEvent.location
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
                          <p className="text-gray-800 font-medium">
                            Virtual Event
                          </p>
                          <p className="text-sm">
                            {safeEvent.location ? (
                              <a
                                href={safeEvent.location}
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
                  {safeEvent.agenda.length > 0 && (
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
                        {safeEvent.agenda.map((item, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-orange-200 pl-4 py-2"
                          >
                            <p className="text-sm text-orange-500 font-medium">
                              {item.time}
                            </p>
                            <h3 className="text-base font-medium text-gray-800 mt-1">
                              {item.title}
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
                      Ticket Sales
                    </h2>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">
                          {safeEvent.soldTickets} sold
                        </span>
                        <span className="text-gray-500">
                          {safeEvent.totalTickets} total
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
                          <DollarSign size={18} className="mr-2" />
                          <span>Revenue</span>
                        </div>
                        <span className="font-medium text-gray-800">
                          ${safeEvent.grossAmount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Users size={18} className="mr-2" />
                          <span>Attendees</span>
                        </div>
                        <span className="font-medium text-gray-800">
                          {safeEvent.soldTickets}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Actions Card */}
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
                      <button className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center">
                        <Ticket size={18} className="mr-2" />
                        <span>Sell Tickets</span>
                      </button>

                      <button
                        className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center justify-center"
                        onClick={() => handleTabChange("attendees")}
                      >
                        <Users size={18} className="mr-2" />
                        <span>Manage Attendees</span>
                      </button>

                      <button className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center">
                        <Download size={18} className="mr-2" />
                        <span>Download Report</span>
                      </button>
                    </div>
                  </motion.div>

                  {/* Event Schedule Card (for recurring events) */}
                  {safeEvent.isRecurring && (
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
                        {safeEvent.dates.length > 1 && (
                          <div className="mt-3 space-y-2">
                            {safeEvent.dates.map((date, index) => (
                              <div key={index} className="flex items-center">
                                <Calendar
                                  size={16}
                                  className="mr-2 text-orange-500"
                                />
                                <span>{formatDate(date)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Attendees Tab */}
            {activeTab === "attendees" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {user?.role === "organizer" ? (
                  <AttendeeList
                    attendees={attendees.concat(
                      getTicketsByEvent(eventId).map((ticket) => ({
                        id: ticket.id,
                        name: ticket.userName,
                        email: ticket.userEmail,
                        phone: "",
                        ticketType: ticket.ticketType,
                        ticketPrice: ticket.price,
                        purchaseDate: ticket.purchaseDate,
                        checkInStatus: ticket.checkInStatus,
                        orderId: ticket.orderId,
                      }))
                    )}
                    eventId={eventId}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Attendees
                    </h2>
                    <p className="text-gray-600 mb-4">
                      This event has {attendeeCount} registered{" "}
                      {attendeeCount === 1 ? "attendee" : "attendees"}.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
              <motion.div
                className="bg-white rounded-lg shadow-sm p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Ticket Management
                </h2>

                {safeEvent.tickets.length > 0 ? (
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
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {safeEvent.tickets.map((ticket, index) => (
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Ticket Settings */}
                    <div className="mt-8 space-y-4">
                      <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                        Update Ticket Prices
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ml-3">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
