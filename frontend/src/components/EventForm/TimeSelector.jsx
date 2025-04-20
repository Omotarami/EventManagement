import React from "react";

/**
 * TimeSelector component
 * Custom input for selecting time with period (AM/PM)
 * 
 * @param {Object} props
 * @param {string} props.timeValue
 * @param {string} props.periodValue 
 * @param {Function} props.onTimeChange 
 * @param {Function} props.onPeriodChange 
 */
const TimeSelector = ({
  timeValue = "",
  periodValue = "AM",
  onTimeChange,
  onPeriodChange
}) => {
  
  const handleTimeInputChange = (e) => {
    let value = e.target.value;
    
    
    value = value.replace(/[^\d:]/g, "");
    
    
    if (!value.includes(":") && value.length > 2) {
      value = `${value.substring(0, 2)}:${value.substring(2)}`;
    }
    
    
    const parts = value.split(":");
    if (parts[0] && parseInt(parts[0]) > 12) {
      parts[0] = "12";
    }
    if (parts[1] && parseInt(parts[1]) > 59) {
      parts[1] = "59";
    }
    
   
    if (parts.length > 1) {
      value = `${parts[0]}:${parts[1]}`;
    }
    
    onTimeChange(value);
  };
  
 
  const handlePeriodChange = (e) => {
    onPeriodChange(e.target.value);
  };

  return (
    <div className="flex">
      {/* Time input */}
      <input
        type="text"
        value={timeValue}
        onChange={handleTimeInputChange}
        placeholder="--:--"
        className="w-20 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        maxLength={5}
      />
      
      {/* AM/PM selector */}
      <select
        value={periodValue}
        onChange={handlePeriodChange}
        className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none bg-no-repeat"
        style={{ 
          width: "60px",
          backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "1.5em 1.5em"
        }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimeSelector;