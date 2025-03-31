import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './global.css';
import AttendeeSignupForm from './pages/AttendeeSignupForm';
import OrganizerSignupForm from './pages/OrganizerSignupForm';

const App = () => {
  return (
          <Router>
            {/* <Navbar /> */}
            <Routes>
              <Route path="/attendee-signup" element={<AttendeeSignupForm />} />
              <Route path="/organizer-signup" element={<OrganizerSignupForm />} />
            </Routes>
          </Router>
  )
}

export default App