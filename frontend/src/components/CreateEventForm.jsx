import React, { useState, useRef, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Tag, FileImage, Type, 
  Repeat, Info, ChevronRight, ChevronLeft, Upload, X, Check
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { EventContext } from '../context/EventContext'; 

const CreateEventForm = () => {
  const navigate = useNavigate();
  

  const eventContext = useContext(EventContext) || {};
  const addEvent = eventContext.addEvent || (newEvent => {
    console.warn('EventContext not available, using fallback storage');
    
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
  });
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    schedule: "one-time",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    eventType: "physical",
    location: "",
    category: "",
    description: "",
  });

  // Image upload state
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);
  
  // Form section state (for multi-step form)
  const [currentSection, setCurrentSection] = useState(0);
  const totalSections = 4;
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }
    
    // Store actual files for form submission
    setImages([...images, ...files]);
    
    // Create preview URLs
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
  };
  
  // Remove an uploaded image
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewImages[index]);
    
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };
  
  // Navigate between form sections
  const goToNextSection = () => {
    if (validateCurrentSection()) {
      setCurrentSection(prev => Math.min(prev + 1, totalSections - 1));
    }
  };
  
  const goToPrevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };
  
  // Validate current section before proceeding
  const validateCurrentSection = () => {
    const newErrors = {};
    
    // Section 0: Basic Info
    if (currentSection === 0) {
      if (!formData.title.trim()) {
        newErrors.title = "Event title is required";
      }
    }
    
    // Section 1: Date and Time
    else if (currentSection === 1) {
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required";
      }
      if (!formData.startTime) {
        newErrors.startTime = "Start time is required";
      }
      if (!formData.endDate) {
        newErrors.endDate = "End date is required";
      }
      if (!formData.endTime) {
        newErrors.endTime = "End time is required";
      }
    }
    
    // Section 2: Location and Category
    else if (currentSection === 2) {
      if (formData.eventType === "physical" && !formData.location.trim()) {
        newErrors.location = "Location is required for physical events";
      }
      if (!formData.category) {
        newErrors.category = "Please select a category";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateCurrentSection()) {
      // Show loading toast
      const loadingToast = toast.loading("Creating your event...");
      
      // Create event object with formatted date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      // Generate a unique ID
      const eventId = Date.now().toString();
      
      // Create new event object
      const newEvent = {
        id: eventId,
        title: formData.title,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        location: formData.location,
        category: formData.category,
        schedule: formData.schedule,
        eventType: formData.eventType,
        // For demo purposes, we'll use the first preview image or a placeholder
        imageSrc: previewImages.length > 0 ? previewImages[0] : "https://via.placeholder.com/400x200",
        // Mock data for EventCard
        soldTickets: 0,
        totalTickets: 100,
        grossAmount: 0,
        status: 'OnSale'
      };
      
      // Simulate API call delay
      setTimeout(() => {
        // Add the event to context
        addEvent(newEvent);
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Event created successfully!");
        
        // Navigate to the event details page
        setTimeout(() => {
          navigate(`/events/${eventId}`);
        }, 1500);
      }, 1000);
    }
  };
  
  // Form section content
  const formSections = [
    // Section 0: Basic Info
    {
      title: "Basic Information",
      icon: <Info size={24} />,
      content: (
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Type size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-orange-500 focus:border-orange-500`}
                placeholder="Give your event a catchy title"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Images (Max 5)
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 ${
                previewImages.length > 0 ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-orange-300'
              } transition-colors cursor-pointer text-center`}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {previewImages.length === 0 ? (
                <div className="flex flex-col items-center">
                  <Upload size={40} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload images or drag and drop
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 justify-center">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="h-24 w-24 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {previewImages.length < 5 && (
                    <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors">
                      <Plus size={24} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Event Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Event Schedule
            </label>
            <div className="flex space-x-4">
              <label className={`
                flex items-center p-3 border rounded-lg cursor-pointer
                ${formData.schedule === 'one-time' 
                  ? 'bg-orange-50 border-orange-300' 
                  : 'bg-white border-gray-300 hover:border-orange-300'
                }
                transition-colors
              `}>
                <input
                  type="radio"
                  name="schedule"
                  value="one-time"
                  checked={formData.schedule === 'one-time'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`
                  inline-block w-5 h-5 rounded-full mr-2
                  ${formData.schedule === 'one-time' 
                    ? 'bg-orange-400 ring-2 ring-orange-200' 
                    : 'bg-gray-200'
                  }
                `}></span>
                <span className="">One-time Event</span>
              </label>
              
              <label className={`
                flex items-center p-3 border rounded-lg cursor-pointer
                ${formData.schedule === 'recurring' 
                  ? 'bg-orange-50 border-orange-300' 
                  : 'bg-white border-gray-300 hover:border-orange-300'
                }
                transition-colors
              `}>
                <input
                  type="radio"
                  name="schedule"
                  value="recurring"
                  checked={formData.schedule === 'recurring'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`
                  inline-block w-5 h-5 rounded-full mr-2
                  ${formData.schedule === 'recurring' 
                    ? 'bg-orange-400 ring-2 ring-orange-200' 
                    : 'bg-gray-200'
                  }
                `}></span>
                <span>Recurring Event</span>
              </label>
            </div>
          </div>
        </div>
      ),
    },
    
    // Other sections remain the same...
    // Section 1: Date and Time
    {
      title: "Date & Time",
      icon: <Calendar size={24} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border ${
                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>
            
            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
            
            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border ${
                    errors.endTime ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>
          
          {/* Recurring Event Options (conditionally shown) */}
          {formData.schedule === "recurring" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-orange-50 p-4 rounded-lg border border-orange-200"
            >
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Repeat size={16} className="mr-1" />
                Recurring Options
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeats
                  </label>
                  <select
                    name="recurringType"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Until
                  </label>
                  <input
                    type="date"
                    name="recurringUntil"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ),
    },
    
    // Section 2: Location and Category
    {
      title: "Location & Category",
      icon: <MapPin size={24} />,
      content: (
        <div className="space-y-6">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Event Type
            </label>
            <div className="flex space-x-4">
              <label className={`
                flex items-center p-3 border rounded-lg cursor-pointer
                ${formData.eventType === 'physical' 
                  ? 'bg-orange-50 border-orange-300' 
                  : 'bg-white border-gray-300 hover:border-orange-300'
                }
                transition-colors
              `}>
                <input
                  type="radio"
                  name="eventType"
                  value="physical"
                  checked={formData.eventType === 'physical'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`
                  inline-block w-5 h-5 rounded-full mr-2
                  ${formData.eventType === 'physical' 
                    ? 'bg-orange-400 ring-2 ring-orange-200' 
                    : 'bg-gray-200'
                  }
                `}></span>
                <span>Physical Event</span>
              </label>
              
              <label className={`
                flex items-center p-3 border rounded-lg cursor-pointer
                ${formData.eventType === 'virtual' 
                  ? 'bg-orange-50 border-orange-300' 
                  : 'bg-white border-gray-300 hover:border-orange-300'
                }
                transition-colors
              `}>
                <input
                  type="radio"
                  name="eventType"
                  value="virtual"
                  checked={formData.eventType === 'virtual'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`
                  inline-block w-5 h-5 rounded-full mr-2
                  ${formData.eventType === 'virtual' 
                    ? 'bg-orange-400 ring-2 ring-orange-200' 
                    : 'bg-gray-200'
                  }
                `}></span>
                <span>Virtual Event</span>
              </label>
            </div>
          </div>
          
          {/* Location (conditionally shown) */}
          <AnimatePresence>
            {formData.eventType === "physical" ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 border ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-orange-500 focus:border-orange-500`}
                    placeholder="Enter event venue address"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter virtual meeting link"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Event Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag size={18} className="text-gray-400" />
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-orange-500 focus:border-orange-500 appearance-none`}
              >
                <option value="">Select a category</option>
                <option value="business">Business</option>
                <option value="educational">Educational</option>
                <option value="fashion">Fashion</option>
                <option value="entertainment">Entertainment</option>
                <option value="fitness">Fitness</option>
                <option value="health">Health</option>
                <option value="technology">Technology</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        </div>
      ),
    },
    
    // Section 3: Description
    {
      title: "Description",
      icon: <FileText size={24} />,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Describe your event in detail. What can attendees expect?"
            ></textarea>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <LightbulbIcon size={16} className="mr-1 text-yellow-500" />
              Tips for a Great Description
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Clearly explain what your event is about</li>
              <li>Mention special guests or speakers</li>
              <li>Highlight what attendees will learn or experience</li>
              <li>Include any special instructions (dress code, etc.)</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];
  
  // Progress indicators for the form sections
  const progressIndicators = formSections.map((section, index) => (
    <div
      key={index}
      className="flex flex-col items-center"
      onClick={() => index < currentSection && setCurrentSection(index)}
    >
      <motion.div
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
          ${index < currentSection 
            ? 'bg-teal-500 text-white' 
            : index === currentSection 
              ? 'bg-orange-400 text-white' 
              : 'bg-gray-200 text-gray-500'
          }
        `}
        whileHover={{ scale: index <= currentSection ? 1.1 : 1 }}
        whileTap={{ scale: index <= currentSection ? 0.95 : 1 }}
      >
        {index < currentSection ? (
          <Check size={18} />
        ) : (
          section.icon
        )}
      </motion.div>
      
      {index < formSections.length - 1 && (
        <div className={`
          w-12 h-1 mt-2 hidden md:block
          ${index < currentSection ? 'bg-teal-500' : 'bg-gray-200'}
        `}></div>
      )}
      
      <span className="text-xs mt-1 text-gray-600 hidden md:block">
        {section.title}
      </span>
    </div>
  ));
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Toast Container */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden"></div>
      {/* Form Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6 text-white">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="text-orange-100 mt-1">Fill in the details to create your awesome event</p>
        </div>
        
        {/* Progress Indicators */}
        <div className="py-4 px-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {progressIndicators}
          </div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`section-${currentSection}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                {formSections[currentSection].icon && (
                  <span className="mr-2">{formSections[currentSection].icon}</span>
                )}
                {formSections[currentSection].title}
              </h3>
              
              {formSections[currentSection].content}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              type="button" // Important: explicitly set to button type
              className={`px-6 py-2 rounded-lg flex items-center ${
                currentSection > 0 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              onClick={goToPrevSection}
              disabled={currentSection === 0}
              whileHover={{ scale: currentSection > 0 ? 1.05 : 1 }}
              whileTap={{ scale: currentSection > 0 ? 0.95 : 1 }}
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </motion.button>
            
            {currentSection < totalSections - 1 ? (
              <motion.button
                type="button" // Important: explicitly set to button type
                className="px-6 py-2 bg-orange-400 text-white rounded-lg flex items-center hover:bg-orange-500"
                onClick={goToNextSection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <ChevronRight size={20} className="ml-1" />
              </motion.button>
            ) : (
              <motion.button
                type="submit" // This button should submit the form
                className="px-6 py-2 bg-teal-500 text-white rounded-lg flex items-center hover:bg-teal-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Event
                <Check size={20} className="ml-1" />
              </motion.button>
            )}
          </div>
        </form>
      </div>
  );
};

// Custom icons for the component
const Plus = ({ className, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Link = ({ className, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const FileText = ({ className, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const LightbulbIcon = ({ className, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M12 2v4"></path>
    <path d="M4.93 10.93l2.83 2.83"></path>
    <path d="M19.07 10.93l-2.83 2.83"></path>
    <path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"></path>
  </svg>
);

export default CreateEventForm;