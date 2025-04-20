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

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useContext(EventContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch event details
  useEffect(() => {
    const eventData = getEventById(eventId);
    if (eventData) {
      setEvent(eventData);
    }
    setLoading(false);
  }, [eventId, getEventById]);

  // Handle back to dashboard
  const handleBack = () => {
    navigate("/organizer-dashboard");
  };

  // Handle edit event
  const handleEdit = () => {
    navigate(`/edit-event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
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

  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate ticket stats
  const ticketPercentage = (event.soldTickets / event.totalTickets) * 100;
  const remainingTickets = event.totalTickets - event.soldTickets;

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
              {event.imageSrc && (
                <img
                  src={event.imageSrc}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Event Status Badge */}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {event.status === "OnSale" && (
                  <span className="text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full inline-block mr-1"></span>
                    On Sale
                  </span>
                )}
                {event.status === "Draft" && (
                  <span className="text-yellow-600 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full inline-block mr-1"></span>
                    Draft
                  </span>
                )}
                {event.status === "Ended" && (
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
                    {event.title}
                  </h1>

                  {/* Event Meta Info */}
                  <div className="mt-2 flex flex-wrap items-center text-gray-600 text-sm">
                    <div className="flex items-center mr-4 mb-2">
                      <Calendar size={16} className="mr-1" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                      <Clock size={16} className="mr-1" />
                      <span>
                        {formatTime(event.startDate)} -{" "}
                        {formatTime(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Tag size={16} className="mr-1" />
                      <span className="capitalize">{event.category}</span>
                    </div>
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

          {/* Event Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                    {event.description ||
                      "No description available for this event."}
                  </p>

                  {/* Only show toggle button if description is long enough */}
                  {event.description && event.description.length > 180 && (
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

                {event.eventType === "physical" ? (
                  <div>
                    <div className="flex items-start">
                      <MapPin size={20} className="text-gray-500 mr-3 mt-1" />
                      <div>
                        <p className="text-gray-800 font-medium">
                          {event.location}
                        </p>
                        {/* Placeholder for Google Maps embedding */}
                        <div className="mt-4 bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">
                            Map preview would appear here
                          </p>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            event.location
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
                      {event.soldTickets} sold
                    </span>
                    <span className="text-gray-500">
                      {event.totalTickets} total
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
                      ${event.grossAmount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users size={18} className="mr-2" />
                      <span>Attendees</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {event.soldTickets}
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

                  <button className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center justify-center">
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
              {event.schedule === "recurring" && (
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
                    {/* Add more recurring event details here */}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
