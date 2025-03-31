import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './global.css';
import AttendeeSignupForm from './pages/AttendeeSignupForm';
import OrganizerSignupForm from './pages/OrganizerSignupForm';
import OnboardingPage from './pages/OnboardingPage';

const App = () => {
  return (
          <Router>
            {/* <Navbar /> */}
            <Routes>
              <Route path="/signup/attendee" element={<AttendeeSignupForm />} />
              <Route path="/signup/organizer" element={<OrganizerSignupForm />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Routes>
          </Router>
  )
}

export default App