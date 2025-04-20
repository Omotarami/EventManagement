import React from "react";
import ImageUploader from "../EventForm/ImageUploader";
import EventBasicInfo from "../EventForm/EventBasicInfo";
import EventSchedule from "../EventForm/EventSchedule";
import EventTypeLocation from "../EventForm/EventTypeLocation";
import EventAgenda from "../EventForm/EventAgenda";
import StepNavigation from "../EventForm/StepNavigation";

/**
 * 
 * 
 * 
 * @param {Object} props
 * @param {Object} props.formData 
 * @param {Function} props.updateFormData 
 * @param {Function} props.onNext 
 */
const EventDetailsStep = ({ formData, updateFormData, onNext }) => {

  const handleImagesChange = (newImages) => {
    updateFormData({ images: newImages });
  };


  const handleBasicInfoChange = (field, value) => {
    updateFormData({ [field]: value });
  };


  const handleScheduleChange = (scheduleData) => {
    updateFormData(scheduleData);
  };

  
  const handleTypeLocationChange = (field, value) => {
    updateFormData({ [field]: value });
  };


  const handleAgendaChange = (newAgenda) => {
    updateFormData({ agenda: newAgenda });
  };

  return (
    <div>
      {/* Image Uploader */}
      <ImageUploader 
        images={formData.images} 
        onImagesChange={handleImagesChange} 
      />

      {/* Event Basic Info (Title, Description, Category) */}
      <EventBasicInfo 
        title={formData.title}
        description={formData.description}
        category={formData.category}
        onChange={handleBasicInfoChange}
      />

      {/* Event Schedule (One-time vs Recurring, Calendar, Time) */}
      <EventSchedule 
        isRecurring={formData.isRecurring}
        dates={formData.dates}
        times={formData.times}
        onChange={handleScheduleChange}
      />

      {/* Event Type and Location */}
      <EventTypeLocation 
        capacity={formData.capacity}
        eventType={formData.eventType}
        location={formData.location}
        onChange={handleTypeLocationChange}
      />

      {/* Event Agenda */}
      <EventAgenda 
        agenda={formData.agenda} 
        onChange={handleAgendaChange} 
      />

      {/* Navigation Buttons */}
      <StepNavigation 
        onNext={onNext} 
        showPrev={false} 
      />
    </div>
  );
};

export default EventDetailsStep;