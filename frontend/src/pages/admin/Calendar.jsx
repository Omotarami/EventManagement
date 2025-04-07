import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Grid, List, Calendar, ChevronDown, Plus, Star, Clock, Users } from "lucide-react";

import DashboardNavbar from "../../components/DashboardNavbar";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import EventCalendar from "../../components/EventCalendar";

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

  const eventsArray = [
    {
      title: "Team Meeting",
      date: new Date(2025, 3, 15), 
      time: "10:00 AM",
      description: "Weekly team sync-up",
      color: "#2A9D8F" 
    },
    {
      title: "Client Presentation",
      date: new Date(2025, 3, 20),
      time: "2:30 PM",
      description: "Quarterly project review",
      color: "#E76F51"
    },
    {
      title: "Product Launch",
      date: new Date(2025, 4, 5), 
      time: "9:00 AM",
      description: "New product release event",
      color: "#264653"
    }
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
          <EventCalendar events={eventsArray} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;