import React from "react";
import { FormSection, FormInput, FormTextArea, FormSelect } from "../EventForm/FormComponents";

/**
 * EventBasicInfo component
 * Handles event title, description, and category
 * 
 * @param {Object} props
 * @param {string} props.title 
 * @param {string} props.description 
 * @param {string} props.category 
 * @param {Function} props.onChange 
 */
const EventBasicInfo = ({ title, description, category, onChange }) => {
  
  const categoryOptions = [
    { value: "music", label: "Music" },
    { value: "business", label: "Business" },
    { value: "food_drink", label: "Food & Drink" },
    { value: "health", label: "Health & Wellness" },
    { value: "sports_fitness", label: "Sports & Fitness" },
    { value: "arts", label: "Arts & Culture" },
    { value: "community", label: "Community & Causes" },
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "fashion", label: "Fashion & Beauty" },
    { value: "other", label: "Other" },
  ];

  return (
    <div>
      {/* Event Title */}
      <FormSection>
        <FormInput
          id="event-title"
          name="title"
          label="Event Title"
          placeholder="Give Your Event A Name"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </FormSection>

      {/* Event Description */}
      <FormSection label="Event Description">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormTextArea
              id="event-description"
              name="description"
              placeholder="Describe Your Events In Detail"
              className="text-black"
              value={description}
              onChange={(e) => onChange("description", e.target.value)}
              rows={5}
              required
            />
          </div>
          <div className="bg-orange-100 rounded-lg p-4 text-sm">
            <h4 className="font-medium text-orange-800 mb-2">Tips for a great description:</h4>
            <ul className="list-disc pl-4 text-orange-700 space-y-1">
              <li>Explain what makes your event unique</li>
              <li>Mention notable speakers or performers</li>
              <li>Describe what attendees will experience</li>
              <li>Include any important policies or rules</li>
            </ul>
          </div>
        </div>
      </FormSection>

      {/* Event Category */}
      <FormSection>
        <FormSelect
        className="text-black bg-amber-100"
          id="event-category"
          name="category"
          label="Event Category"
          placeholder="Select A Category"
          value={category}
          onChange={(e) => onChange("category", e.target.value)}
          options={categoryOptions}
          required
        />
      </FormSection>
    </div>
  );
};

export default EventBasicInfo;