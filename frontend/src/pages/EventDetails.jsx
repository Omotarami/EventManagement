import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EventContext } from "../context/EventContext";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

import EventHeader from "../components/EventDetail/EventHeader";
import EventTabs from "../components/EventDetail/EventTabs";
import EventOverview from "../components/EventDetail/EventOverview";
import EventAttendees from "../components/EventDetail/EventAttendees";
import EventTickets from "../components/EventDetail/EventTickets";
import EventMessagingUI from "../components/EventMessagingUI";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useContext(EventContext);
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Determine if user is viewing details as an attendee
  const isAttendeeView = window.location.pathname.includes('/event-details/');

  // Fetch event data
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

  // Handle navigation back to appropriate dashboard
  const handleBack = () => {
    if (user?.role === "organizer") {
      navigate("/organizer-dashboard");
    } else {
      navigate("/attendee-dashboard");
    }
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle navigating to messages with specific attendee
  const handleMessageAttendee = (attendeeId) => {
    // Navigate to the messages page with the current event selected
    navigate(`/messages?event=${eventId}&attendee=${attendeeId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  // Error state
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

  // Event not found state
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

  // Prepare safe event object (with fallbacks for missing properties)
  const safeEvent = {
    id: event.id,
    title: event.title || "Untitled Event",
    description: event.description || "No description available.",
    status: event.status || "draft",
    imageSrc: event.imageSrc || "",
    startDate: event.startDate || null,
    endDate: event.endDate || null,
    startTime: event.startTime || "TBD",
    endTime: event.endTime || "TBD",
    category: event.category || "Uncategorized",
    location: event.location || "No location specified",
    eventType: event.eventType || "physical",
    isRecurring: event.isRecurring || false,
    dates: Array.isArray(event.dates) ? event.dates : [],
    agenda: Array.isArray(event.agenda) ? event.agenda : [],
    tickets: Array.isArray(event.tickets) ? event.tickets : [],
    totalTickets: event.totalTickets || 0,
    soldTickets: event.soldTickets || 0,
    grossAmount: event.grossAmount || 0,
  };

  // Determine available tabs based on user role
  const availableTabs = [
    { id: "overview", label: "Overview" },
    { id: "attendees", label: "Attendees" },
    { id: "tickets", label: "Tickets" },
  ];
  
  // Add messaging tab for attendees
  if (user?.role === "attendee") {
    availableTabs.push({ id: "messages", label: "Connect" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar */}
      <Sidebar userType={user?.role} />

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

          {/* Event Header - Cover image, title, meta info */}
          <EventHeader 
            event={safeEvent} 
            userRole={user?.role} 
            isAttendeeView={isAttendeeView}
          />

          {/* Event Tabs */}
          <EventTabs 
            tabs={availableTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* Tab Content */}
          <div className="mt-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <EventOverview 
                event={safeEvent} 
                userRole={user?.role}
                eventId={eventId}
              />
            )}

            {/* Attendees Tab */}
            {activeTab === "attendees" && (
              <EventAttendees 
                eventId={eventId} 
                userRole={user?.role}
                onMessageAttendee={handleMessageAttendee}
              />
            )}

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
              <EventTickets 
                event={safeEvent} 
                userRole={user?.role}
              />
            )}

            {/* Messages Tab - Using our EventMessagingUI component */}
            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
                <EventMessagingUI eventId={eventId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;