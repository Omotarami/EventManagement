/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, User, Clock, FileText } from "lucide-react";
import { FormSection, FormInput, FormTextArea, ActionButton } from "../EventForm/FormComponents";
import TimeSelector from "../EventForm/TimeSelector";

/**
 * EventAgenda component
 * Handles event agenda items including speakers, descriptions, and schedules
 * 
 * @param {Object} props
 * @param {Array} props.agenda 
 * @param {Function} props.onChange 
 */
const EventAgenda = ({ agenda = [], onChange }) => {

  const addAgendaItem = () => {
    const newAgenda = [
      ...agenda,
      {
        id: Date.now(), 
        name: "",
        speakers: [],
        description: "",
        time: { time: "", period: "AM" }
      }
    ];
    onChange(newAgenda);
  };

 
  const removeAgendaItem = (itemIndex) => {
    const newAgenda = agenda.filter((_, index) => index !== itemIndex);
    onChange(newAgenda);
  };

  // Add a speaker to an agenda item
  const addSpeaker = (itemIndex) => {
    const newAgenda = [...agenda];
    if (!newAgenda[itemIndex].speakers) {
      newAgenda[itemIndex].speakers = [];
    }
    newAgenda[itemIndex].speakers.push({ name: "" });
    onChange(newAgenda);
  };

  // Remove a speaker from an agenda item
  const removeSpeaker = (itemIndex, speakerIndex) => {
    const newAgenda = [...agenda];
    newAgenda[itemIndex].speakers = newAgenda[itemIndex].speakers.filter(
      (_, index) => index !== speakerIndex
    );
    onChange(newAgenda);
  };

  // Update a field in an agenda item
  const updateAgendaField = (itemIndex, field, value) => {
    const newAgenda = [...agenda];
    newAgenda[itemIndex] = {
      ...newAgenda[itemIndex],
      [field]: value
    };
    onChange(newAgenda);
  };

  // Update a speaker's name
  const updateSpeakerName = (itemIndex, speakerIndex, value) => {
    const newAgenda = [...agenda];
    newAgenda[itemIndex].speakers[speakerIndex].name = value;
    onChange(newAgenda);
  };

  // Update time for an agenda item
  const updateTime = (itemIndex, field, value) => {
    const newAgenda = [...agenda];
    if (!newAgenda[itemIndex].time) {
      newAgenda[itemIndex].time = { time: "", period: "AM" };
    }
    newAgenda[itemIndex].time[field] = value;
    onChange(newAgenda);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <FormSection label="Event Agenda">
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-medium mb-4">Agenda Items</h3>
        
        {/* List of agenda items */}
        <AnimatePresence>
          {agenda.map((item, itemIndex) => (
            <motion.div
              key={item.id || itemIndex}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              {/* Agenda item header with remove button */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Item {itemIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeAgendaItem(itemIndex)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Agenda item name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <FormInput
                  id={`agenda-${itemIndex}-name`}
                  name="name"
                  placeholder="Agenda item name"
                  value={item.name || ""}
                  onChange={(e) => updateAgendaField(itemIndex, "name", e.target.value)}
                />
              </div>

              {/* Speakers */}
              <div className="mb-4 text-black">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speakers
                </label>

                {/* List of speakers */}
                <AnimatePresence>
                  {item.speakers && item.speakers.map((speaker, speakerIndex) => (
                    <motion.div
                      key={`speaker-${itemIndex}-${speakerIndex}`}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center mb-2"
                    >
                      <div className="flex-grow relative">
                        <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          value={speaker.name || ""}
                          onChange={(e) => updateSpeakerName(itemIndex, speakerIndex, e.target.value)}
                          placeholder="Speaker name"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpeaker(itemIndex, speakerIndex)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add speaker button */}
                <ActionButton
                  onClick={() => addSpeaker(itemIndex)}
                  icon={<Plus size={16} />}
                  variant="secondary"
                  className="mt-2"
                >
                  Add Speaker
                </ActionButton>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-gray-500" />
                  <FormTextArea
                    id={`agenda-${itemIndex}-description`}
                    name="description"
                    placeholder="Add Description"
                    value={item.description || ""}
                    onChange={(e) => updateAgendaField(itemIndex, "description", e.target.value)}
                    className="pl-10 text-black"
                    rows={3}
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Time
                </label>
                <div className="flex items-center text-black">
                  <Clock size={16} className="text-black mr-2" />
                  <TimeSelector
                    timeValue={item.time?.time || ""}
                    periodValue={item.time?.period || "AM"}
                    onTimeChange={(value) => updateTime(itemIndex, "time", value)}
                    onPeriodChange={(value) => updateTime(itemIndex, "period", value)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add agenda item button */}
        <ActionButton 
          onClick={addAgendaItem}
          icon={<Plus size={16} />}
          variant={agenda.length === 0 ? "primary" : "secondary"}
          className="w-full justify-center"
        >
          {agenda.length === 0 ? "Add Agenda Item" : "Add Another Item"}
        </ActionButton>
      </div>
    </FormSection>
  );
};

export default EventAgenda;