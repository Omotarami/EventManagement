/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Grid,
  List,
  Calendar,
  Search,
  Heart,
  Star,
  Clock,
  Users,
  Ticket,
  MapPin,
  Bell,
  Loader
} from "lucide-react";
import { Toaster } from "react-hot-toast";

import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import DashboardStatCard from "../components/DashboardStatCard";
import { EventContext } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import AttendeeEventCard from "../components/AttendeeEventCard";

const AttendeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, loading, error, fetchPublicEvents } = useContext(EventContext);

  const [activeTab, setActiveTab] = useState("discover");
  const [viewType, setViewType] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Ensure events are loaded
  useEffect(() => {
    fetchPublicEvents();
  }, []);

  // Filter events based on status for different sections
  const publishedEvents = events.filter(event => event.status === "published" || !event.status);
  const myTickets = events.filter(event => event.status === "ended").slice(0, 3);
  
  // For now, we'll simulate saved events with the first few published events
  // In a real app, you'd have a separate API for saved/favorited events
  const savedEvents = publishedEvents.slice(0, 3);
  
  // Recommended events (all published for now)
  const recommendedEvents = publishedEvents;

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const changeViewType = (type) => {
    setViewType(type);
  };

  const handleViewEventDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleExploreEvents = () => {
    navigate("/events");
  };

  // Filter events based on search term
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalAttendedEvents = myTickets.length;
  const totalSavedEvents = savedEvents.length;
  const upcomingEventsCount = savedEvents.filter(
    (event) => new Date(event.startDate) > new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <Toaster position="top-center" />

      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar with user-specific navigation */}
      <Sidebar userType="attendee" />

      {/* Main Content */}
      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome, {user?.name || "Guest"}!
          </h1>

          {/* Tabs and Toolbar */}
          <div className="flex flex-col mb-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <div className="relative mr-8">
                <button
                  className={`pb-4 font-medium text-base ${
                    activeTab === "discover"
                      ? "text-orange-400"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => changeTab("discover")}
                >
                  Discover
                </button>
                {activeTab === "discover" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>

              <div className="relative mr-8">
                <button
                  className={`pb-4 font-medium text-base ${
                    activeTab === "mytickets"
                      ? "text-orange-400"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => changeTab("mytickets")}
                >
                  My Tickets
                </button>
                {activeTab === "mytickets" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>

              <div className="relative">
                <button
                  className={`pb-4 font-medium text-base ${
                    activeTab === "saved"
                      ? "text-orange-400"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => changeTab("saved")}
                >
                  Saved Events
                </button>
                {activeTab === "saved" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <SearchBar onSearch={handleSearch} />

                {/* View Type Toggle */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                  <button
                    className={`p-1.5 rounded ${
                      viewType === "grid"
                        ? "bg-gray-100 text-teal-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => changeViewType("grid")}
                    aria-label="Grid View"
                  >
                    <Grid size={18} />
                  </button>

                  <button
                    className={`p-1.5 rounded ${
                      viewType === "list"
                        ? "bg-gray-100 text-teal-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => changeViewType("list")}
                    aria-label="List View"
                  >
                    <List size={18} />
                  </button>

                  <button
                    className={`p-1.5 rounded ${
                      viewType === "calendar"
                        ? "bg-gray-100 text-teal-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => changeViewType("calendar")}
                    aria-label="Calendar View"
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </div>

              {/* Explore Events Button */}
              <button
                className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                style={{ backgroundColor: "#F4A261" }}
                onClick={handleExploreEvents}
              >
                <Search size={20} />
                <span>Explore Events</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Stat Cards for attendees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
              <DashboardStatCard
                title="Events Attended"
                value={totalAttendedEvents.toString()}
                accentColor="#2A9D8F"
                icon={
                  <div className="p-2 rounded-full bg-teal-100">
                    <Ticket size={28} color="#2A9D8F" />
                  </div>
                }
                customStyles={{
                  card: {
                    width: "100%",
                  },
                }}
              />

              <DashboardStatCard
                title="Saved Events"
                value={totalSavedEvents.toString()}
                accentColor="#F4A261"
                icon={
                  <div className="p-2 rounded-full bg-orange-100">
                    <Heart size={28} color="#F4A261" />
                  </div>
                }
                customStyles={{
                  card: {
                    width: "100%",
                  },
                }}
              />

              <DashboardStatCard
                title="Upcoming Events"
                value={upcomingEventsCount.toString()}
                accentColor="#9B5DE5"
                icon={
                  <div className="p-2 rounded-full bg-purple-100">
                    <Star size={28} color="#9B5DE5" />
                  </div>
                }
                customStyles={{
                  card: {
                    width: "100%",
                  },
                }}
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader size={40} className="animate-spin text-orange-400" />
                <span className="ml-3 text-gray-600">Loading events...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 text-center p-10 border-2 border-red-200 rounded-lg bg-red-50">
                <h3 className="text-xl font-medium text-red-600 mb-2">
                  Error Loading Events
                </h3>
                <p className="text-gray-700 mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchPublicEvents}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Tab-specific Content */}
            {!loading && !error && activeTab === "discover" && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Recommended Events
                </h2>

                {recommendedEvents.length > 0 ? (
                  <div
                    className={`grid ${
                      viewType === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    } gap-6`}
                  >
                    {recommendedEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleViewEventDetails(event.id)}
                        className="cursor-pointer"
                      >
                       <AttendeeEventCard event={event} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border border-dashed border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-600">
                      No events available at the moment
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Check back later for new events
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && activeTab === "mytickets" && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  My Tickets
                </h2>

                {myTickets.length > 0 ? (
                  <div className="space-y-3">
                    {myTickets.map((event) => {
                      const eventDate = new Date(event.startDate || Date.now());
                      const formattedDate = eventDate.toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      );

                      return (
                        <motion.div
                          key={event.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-all cursor-pointer"
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          }}
                          onClick={() => handleViewEventDetails(event.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {event.title}
                              </h3>
                              <div className="flex items-center mt-1 text-gray-500 text-sm">
                                <Clock size={14} className="mr-1" />
                                <span>{formattedDate}</span>
                                <span className="mx-2">•</span>
                                <MapPin size={14} className="mr-1" />
                                <span>{event.location || "Venue Location"}</span>
                              </div>
                            </div>
                            <button
                              className="text-orange-500 hover:text-orange-600"
                              style={{ color: "#F4A261" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEventDetails(event.id);
                              }}
                            >
                              View Ticket
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-8 border border-dashed border-gray-200 rounded-lg">
                    <Ticket size={32} className="text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">
                      You don't have any tickets yet
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Browse events and book your first ticket
                    </p>
                    <button 
                      className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                      onClick={handleExploreEvents}
                    >
                      Find Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && activeTab === "saved" && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Saved Events
                </h2>

                {savedEvents.length > 0 ? (
                  <div
                    className={`grid ${
                      viewType === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    } gap-6`}
                  >
                    {savedEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleViewEventDetails(event.id)}
                        className="cursor-pointer"
                      >
                      <AttendeeEventCard event={event} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border border-dashed border-gray-200 rounded-lg">
                    <Heart size={32} className="text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">
                      You don't have any saved events
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Save events you're interested in for easy access
                    </p>
                    <button 
                      className="mt-4 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
                      onClick={handleExploreEvents}
                    >
                      Browse Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions for Attendees */}
            {!loading && !error && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    className="p-4 bg-orange-50 rounded-lg text-left hover:bg-orange-100 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    onClick={handleExploreEvents}
                  >
                    <div className="flex items-center space-x-2">
                      <Search size={24} color="#F4A261" />
                      <h3
                        className="font-medium text-orange-500"
                        style={{ color: "#F4A261" }}
                      >
                        Explore Events
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Discover exciting events in your area
                    </p>
                  </motion.button>

                  <motion.button
                    className="p-4 bg-teal-50 rounded-lg text-left hover:bg-teal-100 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => navigate("/settings/notifications")}
                  >
                    <div className="flex items-center space-x-2">
                      <Bell size={24} color="#2A9D8F" />
                      <h3
                        className="font-medium text-teal-500"
                        style={{ color: "#2A9D8F" }}
                      >
                        Notification Settings
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Set up alerts for events you're interested in
                    </p>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Upcoming Events for Attendee */}
            {!loading && !error && savedEvents.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Next Events
                </h2>

                <div className="space-y-3">
                  {savedEvents
                    .filter((event) => new Date(event.startDate || Date.now()) > new Date())
                    .slice(0, 3)
                    .map((event) => {
                      const eventDate = new Date(event.startDate || Date.now());
                      const formattedDate = eventDate.toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      );

                      return (
                        <motion.div
                          key={event.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-all cursor-pointer"
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          }}
                          onClick={() => handleViewEventDetails(event.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {event.title}
                              </h3>
                              <div className="flex items-center mt-1 text-gray-500 text-sm">
                                <Clock size={14} className="mr-1" />
                                <span>{formattedDate}</span>
                                <span className="mx-2">•</span>
                                <MapPin size={14} className="mr-1" />
                                <span>{event.location || "Venue Location"}</span>
                              </div>
                            </div>
                            <button
                              className="text-orange-500 hover:text-orange-600"
                              style={{ color: "#F4A261" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEventDetails(event.id);
                              }}
                            >
                              View details
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Personalized Recommendations */}
            {!loading && !error && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Based on Your Interests
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Music", "Business", "Technology"].map((category, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      onClick={() =>
                        navigate(`/events?category=${category.toLowerCase()}`)
                      }
                    >
                      <div className="text-center">
                        <div
                          className={`p-3 rounded-full inline-block mb-2 ${
                            index === 0
                              ? "bg-purple-100"
                              : index === 1
                              ? "bg-blue-100"
                              : "bg-green-100"
                          }`}
                        >
                          {index === 0 ? (
                            <Star size={24} color="#9B5DE5" />
                          ) : index === 1 ? (
                            <Users size={24} color="#4299E1" />
                          ) : (
                            <Grid size={24} color="#48BB78" />
                          )}
                        </div>
                        <h3 className="font-medium text-gray-800">
                          {category} Events
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Explore popular {category.toLowerCase()} events
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;