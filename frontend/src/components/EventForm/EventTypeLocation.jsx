import React from "react";
import { MapPin, Users } from "lucide-react";
import { FormSection, FormInput, ToggleButton } from "./FormComponents";

/**
 * EventTypeLocation component
 * Handles event capacity, type (physical/virtual), and location
 * 
 * @param {Object} props
 * @param {string} props.capacity 
 * @param {string} props.eventType 
 * @param {string} props.location 
 * @param {Function} props.onChange 
 */
const EventTypeLocation = ({
  capacity = "",
  eventType = "physical",
  location = "",
  onChange
}) => {
  
  const eventTypeOptions = [
    { value: "physical", label: "Physical Event" },
    { value: "virtual", label: "Virtual Event" },
  ];

  
  const handleEventTypeChange = (e) => {
    onChange("eventType", e.target.value);
    
    
    if (e.target.value === "virtual" && location) {
      onChange("location", "");
    }
  };

  return (
    <div>
      {/* Event Capacity */}
      <FormSection label="Event Capacity">
        <FormInput
          id="event-capacity"
          name="capacity"
          placeholder="Enter Maximum Number Of Guests"
          value={capacity}
          onChange={(e) => onChange("capacity", e.target.value)}
          type="number"
          min="1"
          icon={<Users size={18} className="text-gray-500" />}
        />
      </FormSection>

      {/* Event Type */}
      <FormSection label="Event Type">
        <ToggleButton
          name="eventType"
          value={eventType}
          onChange={(e) => handleEventTypeChange(e)}
          options={eventTypeOptions}
        />
      </FormSection>

      {/* Location (only for physical events) */}
      {eventType === "physical" && (
        <FormSection label="Location">
          <FormInput
            id="event-location"
            name="location"
            placeholder="Enter A Location"
            value={location}
            onChange={(e) => onChange("location", e.target.value)}
            icon={<MapPin size={18} className="text-gray-500" />}
          />
        </FormSection>
      )}

      {/* Virtual Meeting Link (only for virtual events) */}
      {eventType === "virtual" && (
        <FormSection label="Meeting Link">
          <FormInput
            id="event-meeting-link"
            name="location"
            placeholder="Enter Meeting Link"
            value={location}
            onChange={(e) => onChange("location", e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            You can enter a Zoom, Google Meet, or other virtual meeting link
          </p>
        </FormSection>
      )}
    </div>
  );
};

export default EventTypeLocation;