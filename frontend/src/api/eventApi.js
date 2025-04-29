import api from './axios'; 

export const eventApi = {
  // Create a new event
  createEvent: (eventData) => {
    return api.post('/event/create', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get all events
  getAllEvents: () => {
    return api.get('/event/all');
  },

  // Get events for a specific user
  getUserEvents: (userId) => {
    return api.get(`/event/user/${userId}`);
  },

  // Get a specific event by ID
  getEventById: (eventId) => {
    return api.get(`/event/detail/${eventId}`);
  },

  // Update an existing event
  updateEvent: (eventId, eventData) => {
    return api.put(`/event/update/${eventId}`, eventData);
  },

  // Delete an event
  deleteEvent: (eventId) => {
    return api.delete(`/event/delete/${eventId}`);
  }
};

export default eventApi;