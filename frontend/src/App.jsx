import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './global.css';
import AttendeeSignupForm from './pages/AttendeeSignupForm';
import OrganizerSignupForm from './pages/OrganizerSignupForm';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import CategorySelectionPage from './pages/CategorySelectionPage';

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
            </Routes>
          </Router>
  )
}

export default App