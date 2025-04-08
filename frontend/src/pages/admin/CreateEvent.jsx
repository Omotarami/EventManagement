// import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import CreateEventForm from "../../components/CreateEventForm";

import DashboardNavbar from "../../components/DashboardNavbar";
import Sidebar from "../../components/Sidebar";

const CreateEvent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CreateEventForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
