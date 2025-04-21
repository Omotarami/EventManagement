/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { FormSection, ToggleButton } from "./FormComponents";
import TimeSelector from "../EventForm/TimeSelector";

const EventSchedule = ({ isRecurring, dates = [], onChange }) => {
  const today = new Date();
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Generate years for dropdown (current year to +10)
  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() + i);

  // Check if a given month/year is in the past
  const isPastMonth = (month, year) => {
    if (year < today.getFullYear()) return true;
    if (year === today.getFullYear() && month < today.getMonth()) return true;
    return false;
  };

  // Format dates array properly on component mount
  useEffect(() => {
    if (dates.length > 0) {
      const formattedDates = dates.map((date) => {
        // Initialize with default time values if they don't exist
        const formattedDate = { ...date };
        if (
          typeof formattedDate.date === "string" &&
          !formattedDate.date.includes("T")
        ) {
          formattedDate.date = new Date(formattedDate.date).toISOString();
        }
        if (!formattedDate.startTime) formattedDate.startTime = "";
        if (!formattedDate.startPeriod) formattedDate.startPeriod = "AM";
        if (!formattedDate.endTime) formattedDate.endTime = "";
        if (!formattedDate.endPeriod) formattedDate.endPeriod = "PM";

        return formattedDate;
      });

      if (JSON.stringify(formattedDates) !== JSON.stringify(dates)) {
        onChange({ dates: formattedDates });
      }
    }
  }, []);

  const eventTypeOptions = [
    { value: "false", label: "One-Time Event" },
    { value: "true", label: "Re-Occurring Event" },
  ];

  const handleScheduleTypeChange = (e) => {
    const newValue = e.target.value === "true";
    onChange({ isRecurring: newValue });
    if (dates.length > 0) {
      onChange({ dates: [] });
    }
  };

  const handleDateSelect = (date) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(12, 0, 0, 0);
    const dateString = selectedDate.toISOString();

    if (!isRecurring) {
      // For one-time events, just replace the date
      const newDate = {
        date: dateString,
        startTime: dates.length > 0 ? dates[0].startTime || "" : "",
        startPeriod: dates.length > 0 ? dates[0].startPeriod || "AM" : "AM",
        endTime: dates.length > 0 ? dates[0].endTime || "" : "",
        endPeriod: dates.length > 0 ? dates[0].endPeriod || "PM" : "PM",
      };
      onChange({ dates: [newDate] });
    } else {
      // For recurring events, check if the date already exists
      const existingIndex = dates.findIndex((d) => {
        const existingDate = new Date(d.date);
        return (
          existingDate.getDate() === selectedDate.getDate() &&
          existingDate.getMonth() === selectedDate.getMonth() &&
          existingDate.getFullYear() === selectedDate.getFullYear()
        );
      });

      if (existingIndex >= 0) {
        // If the date exists, remove it
        const newDates = [...dates];
        newDates.splice(existingIndex, 1);
        onChange({ dates: newDates });
      } else {
        // If the date doesn't exist, add it with default time values
        const newDate = {
          date: dateString,
          startTime: "",
          startPeriod: "AM",
          endTime: "",
          endPeriod: "PM",
        };
        const newDates = [...dates, newDate];
        onChange({ dates: newDates });
      }
    }
  };

  const handleTimeChange = (index, field, value) => {
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    onChange({ dates: newDates });
  };

  // Navigation functions with past month/year restrictions
  const prevMonth = () => {
    if (isPastMonth(currentMonth - 1, currentYear)) return;
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const prevYear = () => {
    if (currentYear <= today.getFullYear()) return;
    setCurrentYear((prev) => prev - 1);
  };

  const nextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  const selectYear = (year) => {
    if (year < today.getFullYear()) return;
    setCurrentYear(year);
    // If selecting current year, make sure month isn't in the past
    if (year === today.getFullYear() && currentMonth < today.getMonth()) {
      setCurrentMonth(today.getMonth());
    }
    setShowYearDropdown(false);
  };

  const generateCalendar = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create current month days only
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true,
    }));

    const isDateSelected = (dayObj) => {
      return dates.some((dateObj) => {
        const date = new Date(dateObj.date);
        return (
          date.getDate() === dayObj.day &&
          date.getMonth() === dayObj.month &&
          date.getFullYear() === dayObj.year
        );
      });
    };

    const isToday = (dayObj) => {
      return (
        dayObj.day === today.getDate() &&
        dayObj.month === today.getMonth() &&
        dayObj.year === today.getFullYear()
      );
    };

    const isPastDate = (dayObj) => {
      const checkDate = new Date(dayObj.year, dayObj.month, dayObj.day);
      return (
        checkDate <
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
    };

    // Check if navigation to previous month/year should be disabled
    const prevMonthDisabled = isPastMonth(currentMonth - 1, currentYear);
    const prevYearDisabled = currentYear <= today.getFullYear();

    return (
      <div className="mb-6">
        {/* Enhanced calendar header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={prevYear}
              disabled={prevYearDisabled}
              className={`p-1 rounded-full ${
                prevYearDisabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Previous year"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              type="button"
              onClick={prevMonth}
              disabled={prevMonthDisabled}
              className={`p-1 rounded-full ${
                prevMonthDisabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-lg font-medium text-gray-800">
              {monthNames[currentMonth]}
            </h2>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                {currentYear}
              </button>
              {showYearDropdown && (
                <div className="absolute z-10 mt-1 w-24 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => selectYear(year)}
                      disabled={year < today.getFullYear()}
                      className={`block w-full px-4 py-2 text-sm text-left text-black ${
                        year === currentYear
                          ? "bg-orange-100 text-orange-800"
                          : year < today.getFullYear()
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={nextYear}
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Next year"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>

        {/* Day names */}
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

        {/* Calendar grid - show empty cells for first days of the month */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the 1st of the month */}
          {Array(firstDay)
            .fill(null)
            .map((_, index) => (
              <div key={`empty-start-${index}`} className="h-10"></div>
            ))}

          {/* Current month days */}
          {currentDays.map((dayObj, index) => {
            const selected = isDateSelected(dayObj);
            const today = isToday(dayObj);
            const pastDate = isPastDate(dayObj);
            const disabled = pastDate;

            return (
              <motion.button
                key={`day-${index}`}
                type="button"
                whileHover={!disabled ? { scale: 1.1 } : {}}
                whileTap={!disabled ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (!disabled) {
                    handleDateSelect(
                      new Date(dayObj.year, dayObj.month, dayObj.day)
                    );
                  }
                }}
                disabled={disabled}
                className={`
                  h-10 flex items-center justify-center text-sm rounded-lg text-black
                  ${pastDate ? "text-gray-400" : ""}
                  ${selected ? "bg-orange-400 text-white font-medium" : ""}
                  ${
                    !selected && today
                      ? "border-2 border-orange-400 font-medium"
                      : ""
                  }
                  ${
                    !selected && !today && !pastDate
                      ? "hover:bg-gray-100 border border-gray-100"
                      : ""
                  }
                  transition-colors duration-150 ease-in-out
                  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                aria-label={`${dayObj.day} ${monthNames[dayObj.month]} ${
                  dayObj.year
                }`}
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
          value={isRecurring ? "true" : "false"}
          onChange={handleScheduleTypeChange}
          options={eventTypeOptions}
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white shadow-sm">
        <div className="flex items-center mb-4 text-gray-700">
          <Calendar size={20} className="mr-2 text-orange-500" />
          <h3 className="font-medium">
            {isRecurring ? "Select multiple dates" : "Select a date"}
          </h3>
        </div>

        {generateCalendar()}

        {dates.length > 0 && (
          <div className="mb-6 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-1 text-orange-500" />
              Selected Dates with Times:
            </h3>
            <div className="space-y-3">
              {dates.map((dateObj, index) => {
                const displayDate = new Date(dateObj.date);

                return (
                  <div
                    key={index}
                    className="flex flex-col p-3 border border-gray-200 rounded-md bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-orange-500" />
                        <span className="text-sm font-medium text-black">
                          {displayDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          const newDates = [...dates];
                          newDates.splice(index, 1);
                          onChange({ dates: newDates });
                        }}
                      >
                        &times;
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-gray-800" />
                        <span className="text-xs text-gray-800 mr-2">
                          Time:
                        </span>
                        <div className="flex items-center text-black">
                          <TimeSelector
                            timeValue={dateObj.startTime || ""}
                            periodValue={dateObj.startPeriod || "AM"}
                            onTimeChange={(value) =>
                              handleTimeChange(index, "startTime", value)
                            }
                            onPeriodChange={(value) =>
                              handleTimeChange(index, "startPeriod", value)
                            }
                          />

                          <span className="mx-2 text-xs text-gray-800">to</span>

                          <TimeSelector
                            timeValue={dateObj.endTime || ""}
                            periodValue={dateObj.endPeriod || "PM"}
                            onTimeChange={(value) =>
                              handleTimeChange(index, "endTime", value)
                            }
                            onPeriodChange={(value) =>
                              handleTimeChange(index, "endPeriod", value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default EventSchedule;
