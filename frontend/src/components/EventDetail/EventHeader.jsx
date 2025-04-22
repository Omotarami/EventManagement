/* eslint-disable no-unused-vars */
import React from "react";
import { Calendar, Clock, MapPin, Tag, Edit, Share, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils"; 

/**
 * 
 * 
 * 
 * @param {Object} props
 * @param {Object} props.event 
 * @param {string} props.userRole 
 * @param {boolean} props.isAttendeeView 
 */
const EventHeader = ({ event, userRole, isAttendeeView }) => {
  const navigate = useNavigate();

  // Handle edit event navigation
  const handleEdit = () => {
    navigate(`/edit-event/${event.id}`);
  };

  // Handle share event
  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: url,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(url)
        .then(() => alert("Event link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  return (
    <div className="bg-white rounded-t-xl shadow-sm overflow-hidden">
      {/* Cover Image with Overlay */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        {event.imageSrc ? (
          <img
            src={event.imageSrc}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Calendar size={40} className="text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Event Status Badge */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
          {event.status === "published" && (
            <span className="text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full inline-block mr-1"></span>
              Published
            </span>
          )}
          {event.status === "draft" && (
            <span className="text-yellow-600 flex items-center">
              <span className="w-2 h-2 bg-yellow-600 rounded-full inline-block mr-1"></span>
              Draft
            </span>
          )}
          {event.status === "ended" && (
            <span className="text-red-600 flex items-center">
              <span className="w-2 h-2 bg-red-600 rounded-full inline-block mr-1"></span>
              Ended
            </span>
          )}
        </div>
      </div>

      {/* Event Title and Action Buttons */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {event.title}
            </h1>

            {/* Event Meta Info */}
            <div className="mt-2 flex flex-wrap items-center text-gray-600 text-sm">
              {event.startDate && (
                <div className="flex items-center mr-4 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
              )}

              {event.startTime && (
                <div className="flex items-center mr-4 mb-2">
                  <Clock size={16} className="mr-1" />
                  <span>
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
              )}

              {event.category && (
                <div className="flex items-center mb-2">
                  <Tag size={16} className="mr-1" />
                  <span className="capitalize">{event.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Different for organizers and attendees */}
          <div className="mt-4 md:mt-0 flex space-x-2">
            {userRole === "organizer" && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <Edit size={16} className="mr-1" />
                  <span>Edit</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="flex items-center px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg transition-colors"
                >
                  <Share size={16} className="mr-1" />
                  <span>Share</span>
                </button>
              </>
            )}

            {userRole === "attendee" && (
              <>
                <button 
                  onClick={handleShare}
                  className="flex items-center px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg transition-colors"
                >
                  <Share size={16} className="mr-1" />
                  <span>Share</span>
                </button>

                <button 
                  onClick={() => navigate('/tickets')}
                  className="flex items-center px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-600 rounded-lg transition-colors"
                >
                  <Download size={16} className="mr-1" />
                  <span>My Tickets</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;