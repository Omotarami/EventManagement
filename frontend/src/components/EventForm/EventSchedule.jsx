/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { FormSection, ToggleButton } from "../EventForm/FormComponents";
import TimeSelector from "../EventForm/TimeSelector";

/**
 * EventSchedule component
 * Handles event schedule selection (one-time vs recurring, dates, times)
 * 
 * @param {Object} props
 * @param {boolean} props.isRecurring 
 * @param {Array} props.dates 
 * @param {Array} props.times 
 * @param {Function} props.onChange 
 */
const EventSchedule = ({ isRecurring, dates = [], times = [], onChange }) => {
  // Current month and year for calendar
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Event type options (one-time vs recurring)
  const eventTypeOptions = [
    { value: false, label: "One-Time Event" },
    { value: true, label: "Re-Occurring Event" },
  ];

  // Handle schedule type change (one-time vs recurring)
  const handleScheduleTypeChange = (e) => {
    // Convert string "true"/"false" to actual boolean
    const newValue = e.target.value === "true";
    onChange({ isRecurring: newValue });
    
    // Clear dates when switching types
    if (dates.length > 0) {
      onChange({ dates: [] });
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    // Full ISO date string that includes time information
    const dateString = new Date(date).toISOString();
    
    // For one-time events, replace any existing date
    // For recurring events, toggle the selected date
    if (!isRecurring) {
      onChange({ dates: [dateString] });
    } else {
      // Check if the date already exists (comparing just the date part)
      const dateExists = dates.some(d => 
        new Date(d).toISOString().split('T')[0] === dateString.split('T')[0]
      );
      
      const newDates = dateExists
        ? dates.filter(d => new Date(d).toISOString().split('T')[0] !== dateString.split('T')[0])
        : [...dates, dateString];
      
      onChange({ dates: newDates });
    }
  };

  // Handle time changes
  const handleTimeChange = (index, field, value) => {
    const newTimes = [...times];
    
    // Create new time entry if needed
    if (!newTimes[index]) {
      newTimes[index] = { startTime: "", startPeriod: "AM", endTime: "", endPeriod: "PM" };
    }
    
    newTimes[index] = { ...newTimes[index], [field]: value };
    onChange({ times: newTimes });
  };

  // Add a new time slot
  const addTimeSlot = () => {
    const newTimes = [
      ...times, 
      { startTime: "", startPeriod: "AM", endTime: "", endPeriod: "PM" }
    ];
    onChange({ times: newTimes });
  };

  // Remove a time slot
  const removeTimeSlot = (index) => {
    const newTimes = [...times];
    newTimes.splice(index, 1);
    onChange({ times: newTimes });
  };

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days
  const generateCalendar = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get days from previous month to fill first week
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const prevDays = Array.from({ length: firstDay }, (_, i) => {
      return {
        day: prevMonthDays - firstDay + i + 1,
        month: currentMonth === 0 ? 11 : currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false
      };
    });
    
    // Current month days
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => {
      return {
        day: i + 1,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      };
    });
    
    // Next month days to complete the calendar
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextDays = Array.from({ length: totalCells - (prevDays.length + currentDays.length) }, (_, i) => {
      return {
        day: i + 1,
        month: currentMonth === 11 ? 0 : currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false
      };
    });
    
    const allDays = [...prevDays, ...currentDays, ...nextDays];
    
    // Check if a date is selected
    const isDateSelected = (dayObj) => {
      const dateString = new Date(dayObj.year, dayObj.month, dayObj.day)
        .toISOString()
        .split("T")[0];
      return dates.includes(dateString);
    };
    
    // Check if a date is today
    const isToday = (dayObj) => {
      const today = new Date();
      return (
        dayObj.day === today.getDate() &&
        dayObj.month === today.getMonth() &&
        dayObj.year === today.getFullYear()
      );
    };
    
    // Check if a date is in the past
    const isPastDate = (dayObj) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(dayObj.year, dayObj.month, dayObj.day);
      return checkDate < today;
    };
    
    return (
      <div className="mb-6">
        {/* Calendar header with month/year and nav buttons */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Day names (Su, Mo, etc.) */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="text-center text-xs font-medium text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {allDays.map((dayObj, index) => {
            const selected = isDateSelected(dayObj);
            const today = isToday(dayObj);
            const pastDate = isPastDate(dayObj);
            
            return (
              <motion.button
                key={index}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!pastDate && dayObj.isCurrentMonth) {
                    handleDateSelect(new Date(dayObj.year, dayObj.month, dayObj.day));
                  }
                }}
                disabled={pastDate || !dayObj.isCurrentMonth}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-full
                  ${!dayObj.isCurrentMonth ? "text-gray-300" : ""}
                  ${pastDate && dayObj.isCurrentMonth ? "text-gray-400" : ""}
                  ${selected ? "bg-orange-400 text-white" : ""}
                  ${!selected && today ? "border border-orange-400" : ""}
                  ${!selected && !today && !pastDate && dayObj.isCurrentMonth ? "hover:bg-gray-100" : ""}
                `}
              >
                {dayObj.day}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <FormSection label="Event Schedule">
      {/* One-time vs Recurring toggle */}
      <div className="mb-6">
        <ToggleButton
          name="scheduleType"
          value={isRecurring}
          onChange={handleScheduleTypeChange}
          options={eventTypeOptions}
        />
      </div>

      {/* Calendar */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        {generateCalendar()}
        
        {/* Selected dates summary */}
        {dates.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Dates:</h3>
            <div className="flex flex-wrap gap-2">
              {dates.map((date, index) => {
                const displayDate = new Date(date);
                return (
                  <div 
                    key={index}
                    className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                  >
                    {displayDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Time selection */}
        {dates.length > 0 && (
          <div>
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Event Time:</h3>
              {isRecurring && times.length > 0 && (
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  + Add another time
                </button>
              )}
            </div>
            
            {/* Time slots */}
            {(times.length === 0 ? [{}] : times).map((time, index) => (
              <div key={index} className="mb-3 flex items-center space-x-4">
                <div className="flex items-center text-black">
                  <Clock size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600 mr-2">Start Time</span>
                  <TimeSelector
                    timeValue={time?.startTime || ""}
                    periodValue={time?.startPeriod || "AM"}
                    onTimeChange={(value) => handleTimeChange(index, "startTime", value)}
                    onPeriodChange={(value) => handleTimeChange(index, "startPeriod", value)}
                  />
                </div>
                
                <div className="flex items-center text-black">
                  <span className="text-sm text-gray-600 mr-2">End Time</span>
                  <TimeSelector
                    timeValue={time?.endTime || ""}
                    periodValue={time?.endPeriod || "PM"}
                    onTimeChange={(value) => handleTimeChange(index, "endTime", value)}
                    onPeriodChange={(value) => handleTimeChange(index, "endPeriod", value)}
                  />
                </div>
                
                {/* Remove button for additional time slots */}
                {isRecurring && times.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default EventSchedule;