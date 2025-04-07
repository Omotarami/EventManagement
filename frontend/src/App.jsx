import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './global.css';
import AttendeeSignupForm from './pages/AttendeeSignupForm';
import OrganizerSignupForm from './pages/OrganizerSignupForm';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import CategorySelectionPage from './pages/CategorySelectionPage';
import Dashboard from './pages/admin/dashboard';
import Calendar from './pages/admin/Calendar';
import CreateEvent from './pages/admin/CreateEvent';

const App = () => {
  return (
          <Router>
            {/* <Navbar /> */}
            <Routes>
              <Route path="/signup/attendee" element={<AttendeeSignupForm />} />
              <Route path="/signup/organizer" element={<OrganizerSignupForm />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/categories" element={<CategorySelectionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/create-event" element={<CreateEvent />} />
            </Routes>
          </Router>
  )
}

export default App