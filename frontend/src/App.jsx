import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./global.css";
import AttendeeSignupForm from "./pages/AttendeeSignupForm";
import OrganizerSignupForm from "./pages/OrganizerSignupForm";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import CategorySelectionPage from "./pages/CategorySelectionPage";
import { Toaster } from "react-hot-toast";
import CreateEventPage from "./pages/CreateEventPage";
import EventProvider from "./context/EventContext";
import ProfileProvider from "./context/ProfileContext";
import TicketProvider from "./context/TicketContext";
import EventDetails from "./pages/EventDetails";
import MyTicketsPage from "./components/Ticket/MyTicketsPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/admin/dashboard";
import AttendeeDashboard from "./pages/AttendeeDashboard";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import NoAccessPage from "./components/NoAccessPage";
import UnderConstruction from "./pages/UnderConstruction";
import Calendar from "./pages/admin/Calendar";
import { AuthProvider } from "./context/AuthContext";
import DashboardRouter from "./components/DashboardRouter";
import Messages from "./pages/Messages";  

const App = () => {
  return (
    <AuthProvider>
      <EventProvider>


        <ProfileProvider>

          <TicketProvider>
            <Router>
              <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup/attendee" element={<AttendeeSignupForm />} />
                <Route path="/signup/organizer" element={<OrganizerSignupForm />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/categories" element={<CategorySelectionPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/no-access" element={<NoAccessPage />} />

                <Route path="/dashboard" element={<DashboardRouter />} />

                <Route
                  path="/organizer-dashboard"
                  element={
                    // <ProtectedRoute allowedRoles={["organizer"]}>
                      <Dashboard />
                    // </ProtectedRoute>
                  }
                />

                <Route
                  path="/attendee-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["attendee"]}>
                      <AttendeeDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/create-event"
                  element={
                    <ProtectedRoute allowedRoles={["organizer"]}>
                      <CreateEventPage />
                     </ProtectedRoute>
                  }
                />

                <Route
                  path="/calendar"
                  element={

          
                    <Calendar />
                  }
                />

               
                <Route
                  path="/messages"
                  element={
                    // <ProtectedRoute>
                      <Messages /> 
                    // </ProtectedRoute>
                  }
                />

                <Route
                  path="/revenue"
                  element={
                    <ProtectedRoute allowedRoles={["organizer"]}>
                      <UnderConstruction />
                    </ProtectedRoute>
                  }
                />

                {/* Tickets Page */}
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute>
                      <MyTicketsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <UnderConstruction />
                    </ProtectedRoute>
                  }
                />

                {/* Profile Page */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Event Detail Pages */}
                {/* For organizers - with editing capabilities */}
                <Route
                  path="/events/:eventId"
                  element={
                    // <ProtectedRoute allowedRoles={["organizer"]}>
                      <EventDetails />
                    // </ProtectedRoute>
                  }
                />

                {/* For attendees - to view event details and purchase */}
                <Route
                  path="/event-details/:eventId"
                  element={
                    <ProtectedRoute>
                      <EventDetails viewOnly={false} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-event/:eventId"
                  element={
                    <ProtectedRoute allowedRoles={["organizer"]}>
                      <UnderConstruction />
                    </ProtectedRoute>
                  }
                />

                {/* 404/Under Construction page */}
                <Route path="*" element={<UnderConstruction />} />
              </Routes>
            </Router>
          </TicketProvider>
        </ProfileProvider>

      </EventProvider>
    </AuthProvider>
  );
};

export default App;