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

const EventDetails = ({ userRole: propsUserRole }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useContext(EventContext);
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Determine user role - use passed prop or derive from URL/user data
  const userRole = propsUserRole || (user?.role || (window.location.pathname.includes('/event-details/') ? 'attendee' : 'organizer'));
  
  // Determine if user is viewing details as an attendee
  const isAttendeeView = window.location.pathname.includes('/event-details/');

  // Debug logging
  console.log("EventDetails - User Role:", userRole);
  console.log("EventDetails - Event ID:", eventId);
  console.log("EventDetails - Is Attendee View:", isAttendeeView);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (eventId) {
          console.log("Fetching event with ID:", eventId);
          const eventData = await getEventById(eventId);
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
    };

    fetchEvent();
  }, [eventId, getEventById]);

  // Handle navigation back to appropriate dashboard
  const handleBack = () => {
    if (userRole === "organizer") {
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

  // For development purposes, create a mock event if none was found
  if (!event) {
    // Create a mock event for testing
    const mockEvent = {
      id: eventId || '1',
      title: "Demo Event",
      description: "This is a demo event for testing purposes.",
      status: "published",
      imageSrc: "",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      startTime: "10:00 AM",
      endTime: "4:00 PM",
      category: "Technology",
      location: "Convention Center",
      eventType: "physical",
      isRecurring: false,
      agenda: [
        {
          time: "10:00 AM",
          title: "Welcome Session",
          description: "Introduction and welcome notes"
        },
        {
          time: "11:00 AM",
          title: "Keynote Speaker",
          description: "Main presentation"
        }
      ],
      tickets: [
        {
          id: "1",
          name: "General Admission",
          price: 49.99,
          description: "Standard entry ticket",
          quantity: 100,
          sold: 45
        },
        {
          id: "2",
          name: "VIP Access",
          price: 149.99,
          description: "Premium access with perks",
          quantity: 20,
          sold: 5
        }
      ],
      totalTickets: 120,
      soldTickets: 50,
      grossAmount: 4250.00
    };
    
    console.log("Using mock event data for development");
    setEvent(mockEvent);
    
    // Note: In production, you would show a "not found" message instead
    /*
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
    */
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
  if (userRole === "attendee") {
    availableTabs.push({ id: "messages", label: "Connect" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar */}
      <Sidebar userType={userRole} />

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
            userRole={userRole} 
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
                userRole={userRole}
                eventId={eventId}
              />
            )}

            {/* Attendees Tab */}
            {activeTab === "attendees" && (
              <EventAttendees 
                eventId={eventId} 
                userRole={userRole}
                onMessageAttendee={handleMessageAttendee}
              />
            )}

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
              <EventTickets 
                event={safeEvent} 
                userRole={userRole}
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