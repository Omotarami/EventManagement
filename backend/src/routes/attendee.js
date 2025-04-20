const express = require("express");
const AttendeeController = require("../controller/attendee");
const useCatchErrors = require("../error/catchErrors");

class AttendeeRoute {
  router = express.Router();
  attendeeController = new AttendeeController();

  path = "/attendee";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Register for event
    this.router.post(
      `${this.path}/register`,
      useCatchErrors(this.attendeeController.registerAttendee)
    );

    // Update attendee record (ticket or comment)
    this.router.put(
      `${this.path}/update/:id`,
      useCatchErrors(this.attendeeController.updateAttendee)
    );

    // Unregister from event
    this.router.delete(
      `${this.path}/unregister/:id`,
      useCatchErrors(this.attendeeController.unregisterAttendee)
    );

    // Get specific attendee record
    this.router.get(
      `${this.path}/:id`,
      useCatchErrors(this.attendeeController.getAttendeeById)
    );

    // Get all attendees for an event
    this.router.get(
      `${this.path}/event/:event_id`,
      useCatchErrors(this.attendeeController.getEventAttendees)
    );

    // Get all events a user is attending
    this.router.get(
      `${this.path}/user/:user_id`,
      useCatchErrors(this.attendeeController.getUserAttendances)
    );
  }
}

module.exports = AttendeeRoute;