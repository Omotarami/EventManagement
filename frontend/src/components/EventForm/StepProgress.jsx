/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

/**
 * StepProgress component
 * Displays the progress of the multi-step form
 * 
 * @param {Object} props
 * @param {number} props.currentStep 
 */
const StepProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Event Details" },
    { id: 2, name: "Tickets" },
    { id: 3, name: "Preview" },
  ];

  return (
    <div className="py-4 px-2 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator with number or checkmark */}
            <div className="flex flex-col items-center">
              {/* Circle indicator */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                  ${
                    step.id < currentStep
                      ? "bg-green-500" // Completed step
                      : step.id === currentStep
                      ? "bg-orange-400" // Current step
                      : "bg-gray-200" // Future step
                  }`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: step.id === currentStep ? 1.1 : 1,
                  transition: { duration: 0.3 } 
                }}
              >
                {step.id < currentStep ? (
                  // Checkmark for completed steps
                  <Check className="text-white" size={16} />
                ) : (
                  // Step number for current and future steps
                  <span className={`text-sm font-medium ${step.id === currentStep ? "text-white" : "text-gray-500"}`}>
                    {step.id}
                  </span>
                )}
              </motion.div>

              {/* Step name */}
              <span
                className={`text-sm font-medium 
                  ${
                    step.id === currentStep
                      ? "text-orange-500" 
                      : step.id < currentStep
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
              >
                {step.name}
              </span>
            </div>

            {/* Connector line between steps (except after last step) */}
            {index < steps.length - 1 && (
              <div 
                className="flex-1 h-0.5 mx-4"
                style={{
                  background: `linear-gradient(to right, 
                    ${step.id < currentStep ? "#22c55e" : "#e5e7eb"} 0%, 
                    ${step.id + 1 <= currentStep ? "#22c55e" : "#e5e7eb"} 100%)`
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;