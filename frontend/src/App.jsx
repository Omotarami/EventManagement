import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./global.css";
import AttendeeSignupForm from "./pages/AttendeeSignupForm";
import OrganizerSignupForm from "./pages/OrganizerSignupForm";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import CategorySelectionPage from "./pages/CategorySelectionPage";
import Dashboard from "./pages/admin/dashboard";
import Calendar from "./pages/admin/Calendar";
import { Toaster } from 'react-hot-toast';
import CreateEvent from "./pages/admin/CreateEvent";
import EventProvider from "./context/EventContext";
import EventDetails from "./pages/EventDetails"
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <EventProvider>
      <Router>
        {/* <Navbar /> */}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup/attendee" element={<AttendeeSignupForm />} />
          <Route path="/signup/organizer" element={<OrganizerSignupForm />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/categories" element={<CategorySelectionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event-details" element={<EventDetails/>} />
        </Routes>
      </Router>
    </EventProvider>
  );
};

export default App;
