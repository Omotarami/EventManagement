import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StepProgress from "../components/EventForm/StepProgress";
import EventDetailsStep from "../components/EventForm/EventDetailsStep";
import TicketsStep from "../components/EventForm/TicketsStep";
import PreviewStep from "../components/EventForm/PreviewStep";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";

const CreateEventPage = () => {
  const navigate = useNavigate();
  
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
    
    
    tickets: [], 
  });

  
  const updateFormData = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

 
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
      window.scrollTo(0, 0); 
    }
  };

 
  const handleSubmit = () => {
    try {
      // Add your API call here Mikey
      // For now i just put success message
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
            <p className="text-sm opacity-90">Fill In The Details To Create Your Event</p>
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