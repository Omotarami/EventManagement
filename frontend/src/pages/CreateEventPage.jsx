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
  const API_URL = "http://localhost:8080/api";

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
      // Add better logging to track form data
      console.log("Submitting event data:", formData);

      // Create FormData for file uploads
      const formDataToSubmit = new FormData();

      // IMPORTANT FIX: Add user_id from localStorage or use a default
      // Make sure to stringify if needed to match what server expects
      formDataToSubmit.append("user_id", localStorage.getItem("userId") || "1");

      // Add basic text fields
      formDataToSubmit.append("title", formData.title || "");
      formDataToSubmit.append("description", formData.description || "");
      formDataToSubmit.append("category", formData.category || "");
      formDataToSubmit.append(
        "schedule_type",
        formData.isRecurring ? "recurring" : "one-time"
      );

      // CRITICAL FIX: Convert capacity to string before appending
      formDataToSubmit.append(
        "capacity",
        formData.capacity ? String(formData.capacity) : ""
      );

      // Add files if present
      formData.images.forEach((image, index) => {
        if (image.file) {
          formDataToSubmit.append("images", image.file);
        }
      });

      // Properly stringify complex objects
      formDataToSubmit.append(
        "schedules",
        JSON.stringify(
          formData.dates.map((date, index) => ({
            day: date,
            start_time: formData.times[index]?.startTime || "",
            end_time: formData.times[index]?.endTime || "",
            location_type: formData.eventType,
            location_details: formData.location,
            comment: "",
          }))
        )
      );

      formDataToSubmit.append(
        "agendas",
        JSON.stringify(
          formData.agenda.map((item) => ({
            name: item.name || "",
            description: item.description || "",
            speakers: item.speakers || [],
            time: item.time ? `${item.time.time} ${item.time.period}` : "",
          }))
        )
      );

      formDataToSubmit.append(
        "tickets",
        JSON.stringify(
          formData.tickets.map((ticket) => ({
            type: ticket.type || "standard",
            name: ticket.name || "",
            price: ticket.type === "paid" ? ticket.price : "0",
            description: ticket.description || "",
            quantity: ticket.quantity || "10",
          }))
        )
      );

      // Log form data for debugging
      for (let [key, value] of formDataToSubmit.entries()) {
        // Don't try to log File objects directly
        if (key === "images") {
          console.log(`${key}: [File object]`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Add auth token to request
      const token = localStorage.getItem("token");

      // Submit the data
      const response = await axios.post(
        "http://localhost:8080/api/event/create",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Server Response:", response.data);
      toast.success("Event created successfully!");
      navigate("/organizer-dashboard");
    } catch (error) {
      console.error("Full Error Response:", error.response?.data);
      console.error("Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      console.error("Event creation error:", error);

      toast.error(error.response?.data?.message || "Failed to create event");
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
