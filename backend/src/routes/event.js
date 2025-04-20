const express = require("express");
const router = express.Router();
const useCatchErrors = require("../error/catchErrors");
const EventController = require("../controller/event");

class EventRoute {
  router = express.Router();
  eventController = new EventController();
  path = "/event";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new event
    this.router.post(
      `${this.path}/create`,
      useCatchErrors(this.eventController.createEvent)
    );

    // Update an existing event
    this.router.put(
      `${this.path}/update/:id`,
      useCatchErrors(this.eventController.updateEvent)
    );

    // Delete an event
    this.router.delete(
      `${this.path}/delete/:id`,
      useCatchErrors(this.eventController.deleteEvent)
    );

    // Get an event by ID
    this.router.get(
      `${this.path}/detail/:id`,
      useCatchErrors(this.eventController.getEventById)
    );

    // Get events by user ID
    this.router.get(
      `${this.path}/:user_id`,
      useCatchErrors(this.eventController.getEventsByUserId)
    );

    // Get all events
    this.router.get(
      `${this.path}/index`,
      useCatchErrors(this.eventController.getAllEvents)
    );
  }
}

module.exports = EventRoute;
