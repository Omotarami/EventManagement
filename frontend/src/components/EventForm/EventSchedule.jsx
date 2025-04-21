/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import { FormSection, ToggleButton } from "./FormComponents";
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
  
  // Format dates array properly on component mount
  useEffect(() => {
    // Ensure all dates are in full ISO format
    if (dates.length > 0) {
      const formattedDates = dates.map(date => {
        if (typeof date === 'string' && !date.includes('T')) {
          // If it's just a date without time (YYYY-MM-DD), convert to full ISO
          return new Date(date).toISOString();
        }
        return date;
      });
      
      if (JSON.stringify(formattedDates) !== JSON.stringify(dates)) {
        onChange({ dates: formattedDates });
      }
    }
  }, []);

  // Event type options (one-time vs recurring)
  const eventTypeOptions = [
    { value: "false", label: "One-Time Event" },
    { value: "true", label: "Re-Occurring Event" },
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
    // Create a date at noon to avoid timezone issues
    const selectedDate = new Date(date);
    selectedDate.setHours(12, 0, 0, 0);
    
    // Full ISO date string that includes time information
    const dateString = selectedDate.toISOString();
    
    // For one-time events, replace any existing date
    // For recurring events, toggle the selected date
    if (!isRecurring) {
      onChange({ dates: [dateString] });
    } else {
      // Check if the date already exists (comparing just the date part)
      const dateExists = dates.some(d => {
        const existingDate = new Date(d);
        return existingDate.getDate() === selectedDate.getDate() && 
               existingDate.getMonth() === selectedDate.getMonth() && 
               existingDate.getFullYear() === selectedDate.getFullYear();
      });
      
      const newDates = dateExists
        ? dates.filter(d => {
            const existingDate = new Date(d);
            return !(existingDate.getDate() === selectedDate.getDate() && 
                   existingDate.getMonth() === selectedDate.getMonth() && 
                   existingDate.getFullYear() === selectedDate.getFullYear());
          })
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
    
    // Check if a date is selected by comparing year, month, and day
    const isDateSelected = (dayObj) => {
      return dates.some(dateStr => {
        const date = new Date(dateStr);
        return date.getDate() === dayObj.day && 
               date.getMonth() === dayObj.month && 
               date.getFullYear() === dayObj.year;
      });
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
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-medium text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Day names (Su, Mo, etc.) */}
        <div className="grid grid-cols-7 gap-1 mb-2 border-b border-gray-100 pb-2">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="text-center text-sm font-medium text-gray-600 py-1"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
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
                  h-10 flex items-center justify-center text-sm rounded-lg
                  ${!dayObj.isCurrentMonth ? "text-gray-300" : ""}
                  ${pastDate && dayObj.isCurrentMonth ? "text-gray-400" : ""}
                  ${selected ? "bg-orange-400 text-white font-medium" : ""}
                  ${!selected && today ? "border-2 border-orange-400 font-medium" : ""}
                  ${!selected && !today && !pastDate && dayObj.isCurrentMonth ? "hover:bg-gray-100 border border-gray-100" : ""}
                  transition-colors duration-150 ease-in-out
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
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select event type:
        </label>
        <ToggleButton
          name="scheduleType"
          value={isRecurring ? "true" : "false"} // Convert boolean to string for the component
          onChange={handleScheduleTypeChange}
          options={eventTypeOptions}
        />
      </div>

      {/* Calendar */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white shadow-sm">
        <div className="flex items-center mb-4 text-gray-700">
          <Calendar size={20} className="mr-2 text-orange-500" />
          <h3 className="font-medium">
            {isRecurring ? "Select multiple dates" : "Select a date"}
          </h3>
        </div>
        
        {generateCalendar()}
        
        {/* Selected dates summary */}
        {dates.length > 0 && (
          <div className="mb-6 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-1 text-orange-500" />
              Selected Dates:
            </h3>
            <div className="flex flex-wrap gap-2">
              {dates.map((date, index) => {
                const displayDate = new Date(date);
                return (
                  <div 
                    key={index}
                    className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-md flex items-center"
                  >
                    {displayDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                    <button
                      type="button"
                      className="ml-2 text-orange-600 hover:text-orange-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newDates = [...dates];
                        newDates.splice(index, 1);
                        onChange({ dates: newDates });
                      }}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Time selection */}
        {dates.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="mb-3 flex justify-between items-center">
              <h3 className="font-medium text-gray-700 flex items-center">
                <Clock size={16} className="mr-2 text-orange-500" />
                Event Time{isRecurring && times.length > 1 ? "s" : ""}:
              </h3>
              {isRecurring && (
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center"
                >
                  + Add another time
                </button>
              )}
            </div>
            
            {/* Time slots */}
            <div className="space-y-4">
              {(times.length === 0 ? [{}] : times).map((time, index) => (
                <div 
                  key={index} 
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap items-center gap-4"
                >
                  <div className="flex items-center text-black">
                    <span className="text-sm font-medium text-gray-700 mr-2">Start:</span>
                    <TimeSelector
                      timeValue={time?.startTime || ""}
                      periodValue={time?.startPeriod || "AM"}
                      onTimeChange={(value) => handleTimeChange(index, "startTime", value)}
                      onPeriodChange={(value) => handleTimeChange(index, "startPeriod", value)}
                    />
                  </div>
                  
                  <div className="flex items-center text-black">
                    <span className="text-sm font-medium text-gray-700 mr-2">End:</span>
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
                      className="text-sm text-red-500 hover:text-red-600 ml-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default EventSchedule;