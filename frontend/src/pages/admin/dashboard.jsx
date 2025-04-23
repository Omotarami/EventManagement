import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Grid, List, Calendar, ChevronDown, Plus, Star, Clock, Users } from "lucide-react";
import { Toaster } from "react-hot-toast";

import DashboardNavbar from "../../components/DashboardNavbar";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import DashboardStatCard from "../../components/DashboardStatCard";
import EventCard from "../../components/EventCard";
import { EventContext } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, deleteEvent } = useContext(EventContext);
  
  
  // useEffect(() => {
  //   if (user?.account_type !== 'organizer') {
  //     navigate('/no-access');
  //   }
  // }, [user, navigate]);

 
  const [activeTab, setActiveTab] = useState("planned");
  const [viewType, setViewType] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Change active tab
  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  // Change view type (grid, list, calendar)
  const changeViewType = (type) => {
    setViewType(type);
  };

  // Navigate to create event page
  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  // Navigate to edit event page
  const handleEditEvent = (eventId) => {
    console.log("Navigating to edit event with ID:", eventId);
    navigate(`/edit-event/${eventId}`);
  };
  
  // Delete an event
  const handleDeleteEvent = (eventId) => {
    console.log("Deleting event with ID:", eventId);
    deleteEvent(eventId);
  };

  // Navigate to event details page
  const handleViewEventDetails = (eventId) => {
    console.log("Navigating to event details with ID:", eventId);
    // Make sure the ID is valid and exists before navigating
    if (!eventId) {
      console.error("Invalid event ID:", eventId);
      return;
    }
    navigate(`/events/${eventId}`);
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dashboard statistics
  const totalRevenue = events.reduce((sum, event) => sum + (event.grossAmount || 0), 0);
  const totalAttendees = events.reduce((sum, event) => sum + (event.soldTickets || 0), 0);
  const totalEvents = events.length;

  // Get upcoming events for the quick view section
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  // Log event IDs to help with debugging
  useEffect(() => {
    console.log("Available events:", events.map(e => ({ id: e.id, title: e.title })));
  }, [events]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <Toaster position="top-center" />
      
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>

          {/* Tabs and Toolbar */}
          <div className="flex flex-col mb-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <div className="relative mr-8">
                <button
                  className={`pb-4 font-medium text-base ${
                    activeTab === "planned"
                      ? "text-orange-400"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => changeTab("planned")}
                >
                  Planned
                </button>
                {activeTab === "planned" && (
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
                    activeTab === "attended"
                      ? "text-orange-400"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => changeTab("attended")}
                >
                  Past Events
                </button>
                {activeTab === "attended" && (
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

              {/* Create Event Button */}
              <button
                className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                style={{ backgroundColor: "#F4A261" }}
                onClick={handleCreateEvent}
              >
                <Plus size={20} />
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Stat Cards in a row using flex */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
              <DashboardStatCard
                title="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                accentColor="#F4A261" 
                icon={
                  <div className="p-2 rounded-full bg-orange-100">
                    <Calendar size={28} color="#F4A261" />
                  </div>
                }
                customStyles={{
                  card: {
                    width: '100%', 
                  }
                }}
              />
              
              <DashboardStatCard
                title="Total Attendees"
                value={totalAttendees.toLocaleString()}
                accentColor="#2A9D8F" 
                icon={
                  <div className="p-2 rounded-full bg-teal-100">
                    <Users size={28} color="#2A9D8F" />
                  </div>
                }
                customStyles={{
                  card: {
                    width: '100%',
                  }
                }}
              />
              
              <DashboardStatCard
                title="Total Events"
                value={totalEvents.toString()}
                accentColor="#9B5DE5" 
                icon={
                  <div className="p-2 rounded-full bg-purple-100">
                    <Star size={28} color="#9B5DE5" />
                  </div>
                }
                customStyles={{
                  card: {
                    width: '100%', 
                  }
                }}
              />
            </div>
            
            {/* Events Grid */}
            {events.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Events</h2>
                
                <div className={`grid ${viewType === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
                  {filteredEvents.map(event => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="cursor-pointer"
                    >
                      <EventCard
                        eventName={event.title}
                        soldTickets={event.soldTickets || 0}
                        totalTickets={event.totalTickets || 0}
                        grossAmount={event.grossAmount || 0}
                        status={event.status || 'published'}
                        imageSrc={event.imageSrc}
                        eventDate={event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }) : ''}
                        location={event.location}
                        category={event.category}
                        onEdit={() => handleEditEvent(event.id)}
                        onDelete={() => handleDeleteEvent(event.id)}
                        onClick={() => handleViewEventDetails(event.id)}
                        event={event}         
                        userRole="organizer"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center p-10 border-2 border-dashed border-gray-200 rounded-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No Events Yet</h3>
                  <p className="text-gray-500 mb-4">Create your first event to get started!</p>
                  <button
                    onClick={handleCreateEvent}
                    className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
                    style={{ backgroundColor: "#F4A261" }}
                  >
                    Create Event
                  </button>
                </motion.div>
              </div>
            )}
            
            {/* Upcoming Events List (if we have any events) */}
            {events.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
                
                <div className="space-y-3">
                  {upcomingEvents.map(event => {
                    // Format the date safely
                    const formattedDate = event.startDate ? 
                      new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'TBD';
                    
                    return (
                      <motion.div 
                        key={event.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-all cursor-pointer"
                        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        onClick={() => handleViewEventDetails(event.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-800">{event.title}</h3>
                            <div className="flex items-center mt-1 text-gray-500 text-sm">
                              <Clock size={14} className="mr-1" />
                              <span>{formattedDate}</span>
                              <span className="mx-2">•</span>
                              <Users size={14} className="mr-1" />
                              <span>{event.soldTickets || 0} attendees</span>
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
            
            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  className="p-4 bg-orange-50 rounded-lg text-left hover:bg-orange-100 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  onClick={handleCreateEvent}
                >
                  <h3 className="font-medium text-orange-500" style={{ color: "#F4A261" }}>Create New Event</h3>
                  <p className="text-sm text-gray-500 mt-1">Start setting up your next amazing event</p>
                </motion.button>
                
                <motion.button
                  className="p-4 bg-teal-50 rounded-lg text-left hover:bg-teal-100 transition-colors"
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="font-medium text-teal-500" style={{ color: "#2A9D8F" }}>Generate Event Report</h3>
                  <p className="text-sm text-gray-500 mt-1">Create an analytics report of past events</p>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;