/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const handleSubmit = async () => {
    try {
      // Prepare form data for API submission
      const formDataToSubmit = new FormData();

      // Add basic event details
      formDataToSubmit.append('user_id', localStorage.getItem('userId') || '1'); 
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('schedule_type', formData.isRecurring ? 'recurring' : 'one-time');
      formDataToSubmit.append('capacity', formData.capacity);

      // Add images
      formData.images.forEach((image, index) => {
        if (image.file) {
          formDataToSubmit.append('images', image.file);
        }
      });

      // Prepare and add schedules
      const schedules = formData.dates.map((date, index) => ({
        day: date,
        start_time: formData.times[index]?.startTime || '',
        end_time: formData.times[index]?.endTime || '',
        location_type: formData.eventType,
        location_details: formData.location
      }));
      formDataToSubmit.append('schedules', JSON.stringify(schedules));

      // Prepare and add agendas
      const agendas = formData.agenda.map(item => ({
        name: item.name,
        description: item.description,
        speakers: item.speakers,
        time: `${item.time.time} ${item.time.period}`
      }));
      formDataToSubmit.append('agendas', JSON.stringify(agendas));

      // Prepare and add tickets
      const tickets = formData.tickets.map(ticket => ({
        type: ticket.type,
        name: ticket.name,
        price: ticket.type === 'paid' ? ticket.price : '0',
        description: ticket.description,
        quantity: ticket.quantity
      }));
      formDataToSubmit.append('tickets', JSON.stringify(tickets));

      // Submit to API
      const response = await axios.post('/api/event/create', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Create a local representation for context
      const newEvent = {
        id: response.data.event.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.dates[0],
        endDate: formData.dates[formData.dates.length - 1],
        startTime: formData.times[0]?.startTime,
        endTime: formData.times[0]?.endTime,
        location: formData.location,
        eventType: formData.eventType,
        isRecurring: formData.isRecurring,
        agenda: formData.agenda,
        totalTickets: parseInt(formData.capacity) || 0,
        soldTickets: 0,
        grossAmount: 0,
        status: 'published',
        imageSrc: response.data.event.images[0]?.url || '',
        tickets: formData.tickets.map(ticket => ({
          ...ticket,
          sold: 0
        }))
      };

      // Add event to context
      addEvent(newEvent);

      toast.success("Event created successfully!");

      // Navigate to dashboard after successful creation
      navigate("/organizer-dashboard");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.error || "Failed to create event. Please try again.");
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