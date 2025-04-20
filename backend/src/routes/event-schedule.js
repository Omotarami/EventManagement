const express = require("express");
const EventScheduleController = require("../controller/event-schedule");
const useCatchErrors = require("../error/catchErrors");

class EventScheduleRoute {
  router = express.Router();
  eventScheduleController = new EventScheduleController();

  path = "/event-schedule";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      useCatchErrors(this.eventScheduleController.createEventSchedule)
    );
    this.router.put(
      `${this.path}/update/:id`,
      useCatchErrors(this.eventScheduleController.updateEventSchedule)
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      useCatchErrors(this.eventScheduleController.deleteEventSchedule)
    );
    this.router.get(
      `${this.path}/:id`,
      useCatchErrors(this.eventScheduleController.getScheduleById)
    );
    this.router.get(
      `${this.path}/event/:event_id`,
      useCatchErrors(this.eventScheduleController.getSchedulesByEventId)
    );
    this.router.get(
      `${this.path}/all`,
      useCatchErrors(this.eventScheduleController.getAllSchedules)
    );
  }
}

module.exports = EventScheduleRoute;