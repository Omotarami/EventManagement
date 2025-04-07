import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Grid, List, Calendar, ChevronDown, Plus, Star, Clock, Users } from "lucide-react";

import DashboardNavbar from "../../components/DashboardNavbar";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import DashboardStatCard from "../../components/DashboardStatCard";

const Dashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("planned");

  // State for view type
  const [viewType, setViewType] = useState("grid");

  // State for event filter
  // eslint-disable-next-line no-unused-vars
  const [eventFilter, setEventFilter] = useState("all");

  // Handle search
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // Implement search logic
  };

  // Handle tab change with animation
  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  // Toggle view type
  const changeViewType = (type) => {
    setViewType(type);
  };

  // Toggle event filter
  const toggleEventFilter = () => {
    // Toggle logic
    console.log("Toggle event filter");
  };

  // Handle create event
  const handleCreateEvent = () => {
    console.log("Create new event");
    // Navigate to event creation page
  };

  // Mock data for upcoming events
  const upcomingEvents = [
    { id: 1, title: "Team Building Workshop", date: "Apr 12", attendees: 18 },
    { id: 2, title: "Product Launch Party", date: "Apr 15", attendees: 45 },
    { id: 3, title: "Design Thinking Session", date: "Apr 20", attendees: 12 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                  Attended
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

                {/* Event Filter */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={toggleEventFilter}
                  >
                    <span>All Events</span>
                    <ChevronDown size={16} />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              </div>

              {/* Create Event Button */}
              <button
                className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                style={{ backgroundColor: "#F4A261" }}
                onClick={handleCreateEvent}
              >
                <Plus size={25} />
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Stat Cards in a row using flex */}
            <div className="grid grid-cols-3 gap-4 mb-8 w-full">
              <DashboardStatCard
                title="Total Revenue"
                value="$48,000"
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
                value="248"
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
                value="10"
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
            
            {/* Additional Content Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
              
              {/* Upcoming Events List */}
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <motion.div 
                    key={event.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-all"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <div className="flex items-center mt-1 text-gray-500 text-sm">
                          <Clock size={14} className="mr-1" />
                          <span>{event.date}</span>
                          <span className="mx-2">•</span>
                          <Users size={14} className="mr-1" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                      <button 
                        className="text-orange-500 hover:text-orange-600"
                        style={{ color: "#F4A261" }}
                      >
                        View details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    className="p-4 bg-orange-50 rounded-lg text-left hover:bg-orange-100 transition-colors"
                    whileHover={{ scale: 1.03 }}
                  >
                    <h3 className="font-medium text-orange-500" style={{ color: "#F4A261" }}>Send Event Invitations</h3>
                    <p className="text-sm text-gray-500 mt-1">Quickly invite attendees to your next event</p>
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
    </div>
  );
};

export default Dashboard;