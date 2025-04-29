/**
 * Formats a date string into a user-friendly format
 * 
 * @param {string} dateString - ISO date string to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const defaultOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options
    };

    return date.toLocaleDateString("en-US", defaultOptions);
  } catch (err) {
    console.error("Error formatting date:", err);
    return "Error formatting date";
  }
};

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  const now = new Date();
  const diffMs = date - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHr / 24);
  
  if (diffDays > 30) {
    return formatDate(dateString, { 
      month: "short", 
      day: "numeric",
      year: "numeric" 
    });
  }
  
  if (diffDays > 0) {
    return diffDays === 1 ? "tomorrow" : `in ${diffDays} days`;
  }
  
  if (diffDays < 0 && diffDays > -30) {
    return diffDays === -1 ? "yesterday" : `${Math.abs(diffDays)} days ago`;
  }
  
  if (diffHr > 0) {
    return diffHr === 1 ? "in 1 hour" : `in ${diffHr} hours`;
  }
  
  if (diffHr < 0) {
    return diffHr === -1 ? "1 hour ago" : `${Math.abs(diffHr)} hours ago`;
  }
  
  if (diffMin > 0) {
    return diffMin === 1 ? "in 1 minute" : `in ${diffMin} minutes`;
  }
  
  if (diffMin < 0) {
    return diffMin === -1 ? "1 minute ago" : `${Math.abs(diffMin)} minutes ago`;
  }
  
  return diffSec >= 0 ? "just now" : "just now";
};

/**
 * Formats a time value that might come in different formats
 * 
 * @param {string|Object} timeValue - Time value to format
 * @returns {string} Formatted time string
 */
export const formatTimeValue = (timeValue) => {
  if (!timeValue) return "TBD";

  if (typeof timeValue === "object" && timeValue !== null) {
    if ("time" in timeValue && "period" in timeValue) {
      return `${timeValue.time} ${timeValue.period}`;
    }

    return JSON.stringify(timeValue);
  }

  return timeValue;
};

/**
 * Checks if a date is in the past
 * 
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the past
 */
export const isDatePast = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  return date < now;
};

/**
 * Returns date in ISO format (YYYY-MM-DD)
 * 
 * @param {Date} date - Date object
 * @returns {string} Date in ISO format
 */
export const getISODateString = (date) => {
  if (!date) return "";
  
  return date.toISOString().split('T')[0];
};

/**
 * Adds days to a date
 * 
 * @param {Date} date - Original date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Gets date range string (e.g., "Apr 12 - Apr 15, 2025")
 * 
 * @param {string} startDateString - Start date ISO string
 * @param {string} endDateString - End date ISO string
 * @returns {string} Formatted date range
 */
export const getDateRangeString = (startDateString, endDateString) => {
  if (!startDateString) return "TBD";
  
  const startDate = new Date(startDateString);
  
  if (!endDateString) {
    return formatDate(startDateString, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  
  const endDate = new Date(endDateString);
  
  // Same day
  if (startDate.toDateString() === endDate.toDateString()) {
    return formatDate(startDateString, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  
  // Same month and year
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${formatDate(startDateString, { month: "short", day: "numeric" })} - ${formatDate(
      endDateString,
      { day: "numeric", year: "numeric" }
    )}`;
  }
  
  // Same year
  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${formatDate(startDateString, {
      month: "short",
      day: "numeric"
    })} - ${formatDate(endDateString, {
      month: "short",
      day: "numeric",
      year: "numeric"
    })}`;
  }
  
  // Different years
  return `${formatDate(startDateString, {
    month: "short",
    day: "numeric",
    year: "numeric"
  })} - ${formatDate(endDateString, {
    month: "short",
    day: "numeric",
    year: "numeric"
  })}`;
};