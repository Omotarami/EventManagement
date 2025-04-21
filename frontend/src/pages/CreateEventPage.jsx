import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StepProgress from "../components/EventForm/StepProgress";
import EventDetailsStep from "../components/EventForm/EventDetailsStep";
import TicketsStep from "../components/EventForm/TicketsStep";
import PreviewStep from "../components/EventForm/PreviewStep";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";
import { EventContext } from "../context/EventContext";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { addEvent } = useContext(EventContext);

  // Track the current step
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize form data state
  const [formData, setFormData] = useState({
    // Event Details
    images: [],
    title: "",
    description: "",
    category: "",
    eventType: "physical",
    isRecurring: false,
    dates: [],
    times: [],
    capacity: "",
    location: "",
    agenda: [],

    // Tickets
    tickets: [],
  });

  // Handle form data updates - this will be passed to each step component
  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0); // Scroll to top on step change
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
      window.scrollTo(0, 0); // Scroll to top on step change
    }
  };

  // Handle form submission - called from preview step
  const handleSubmit = () => {
    try {
      // Create a new event object formatted for the event context
      const newEvent = {
        id: Date.now().toString(), // Generate a unique ID
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.dates[0], // Use first selected date as start date
        endDate: formData.dates[formData.dates.length - 1], // Last date if recurring

        // Calculate start and end times based on first time slot
        startTime:
          formData.times.length > 0
            ? `${formData.times[0].startTime} ${formData.times[0].startPeriod}`
            : "",
        endTime:
          formData.times.length > 0
            ? `${formData.times[0].endTime} ${formData.times[0].endPeriod}`
            : "",

        location: formData.location,
        eventType: formData.eventType,
        isRecurring: formData.isRecurring,
        agenda: formData.agenda,

        // Calculate total capacity from input
        totalTickets: parseInt(formData.capacity) || 0,
        soldTickets: 0, // New events start with 0 tickets sold

        // Calculate initial gross amount (0 for new events)
        grossAmount: 0,

        // Set initial status to published
        status: "published",

        // Get first image if available
        imageSrc:
          formData.images.length > 0
            ? formData.images[0].preview || formData.images[0].url
            : "",

        // Add tickets information
        tickets: formData.tickets.map((ticket) => ({
          ...ticket,
          sold: 0, // Initialize sold count to 0
        })),
      };

      // Add event to context
      addEvent(newEvent);

      toast.success("Event created successfully!");

      // Navigate to dashboard after successful creation
      navigate("/organizer-dashboard");
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
      console.error("Error creating event:", error);
    }
  };

  // Validate the current step before moving to next
  const validateStep = (step) => {
    switch (step) {
      case 1: // Event Details
        if (!formData.title) {
          toast.error("Event title is required");
          return false;
        }
        if (!formData.description) {
          toast.error("Event description is required");
          return false;
        }
        if (!formData.category) {
          toast.error("Please select an event category");
          return false;
        }
        if (formData.dates.length === 0) {
          toast.error("Please select at least one event date");
          return false;
        }
        if (formData.times.length === 0) {
          toast.error("Please add start and end times for your event");
          return false;
        }
        if (!formData.location && formData.eventType === "physical") {
          toast.error("Location is required for physical events");
          return false;
        }
        return true;

      case 2: // Tickets
        if (formData.tickets.length === 0) {
          toast.error("Please add at least one ticket type");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Handle next button with validation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <TicketsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <PreviewStep
            formData={formData}
            updateFormData={updateFormData}
            onPrev={prevStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return <EventDetailsStep />;
    }
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
          {/* Header */}
          <div className="bg-orange-400 text-white p-4 rounded-t-lg">
            <h1 className="text-xl font-bold">Create New Event</h1>
            <p className="text-sm opacity-90">
              Fill In The Details To Create Your Event
            </p>
          </div>

          {/* Step Progress */}
          <StepProgress currentStep={currentStep} />

          {/* Form Content */}
          <div className="bg-white rounded-b-lg shadow p-6 mb-8">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
