/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * StepNavigation component
 * Navigation buttons for multi-step form (Back, Next, Submit)
 * 
 * @param {Object} props
 * @param {Function} props.onNext 
 * @param {Function} props.onPrev 
 * @param {boolean} props.showPrev 
 * @param {boolean} props.isLast 
 * @param {string} props.nextLabel 
 * @param {string} props.prevLabel 
 */
const StepNavigation = ({ 
  onNext, 
  onPrev, 
  showPrev = true, 
  isLast = false,
  nextLabel = "Next",
  prevLabel = "Back" 
}) => {
  
  // Animation variants for buttons
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="flex justify-between mt-8">
      {/* Back button - only shown if showPrev is true */}
      {showPrev ? (
        <motion.button
          type="button"
          onClick={onPrev}
          className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg transition-colors hover:bg-gray-50"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronLeft size={18} className="mr-1" />
          {prevLabel}
        </motion.button>
      ) : (
        <div></div> // Empty div to maintain flex justify-between
      )}

      {/* Next/Submit button */}
      <motion.button
        type="button"
        onClick={onNext}
        className="flex items-center px-6 py-2 bg-orange-400 text-white rounded-lg transition-colors hover:bg-orange-500"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isLast ? (
          "Publish Event"
        ) : (
          <>
            {nextLabel}
            <ChevronRight size={18} className="ml-1" />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default StepNavigation;