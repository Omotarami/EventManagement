import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from './pages/SignupForm';

const App = () => {
  return (
          <Router>
            {/* <Navbar /> */}
            <Routes>
              <Route path="/signup" element={<SignupForm />} />
            </Routes>
          </Router>
  )
}

export default App