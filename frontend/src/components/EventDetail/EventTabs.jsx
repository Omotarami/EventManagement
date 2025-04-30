/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

/**
 * Reusable tabs component for event detail pages
 * 
 * @param {Object} props
 * @param {Array} props.tabs 
 * @param {string} props.activeTab 
 * @param {function} props.onTabChange
 */
const EventTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
            
            {/* Animated indicator for active tab */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTabs;