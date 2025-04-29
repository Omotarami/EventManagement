const express = require("express");
const TicketController = require("../controller/TicketController");
const { isAuthenticated } = require("../middlewares/auth");
const useCatchErrors = require("../error/catchErrors");

class TicketRoute {
  router = express.Router();
  ticketController = new TicketController();
  path = "/ticket";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Purchase a ticket
    this.router.post(
      `${this.path}/purchase`,
      isAuthenticated,
      useCatchErrors(this.ticketController.purchaseTicket.bind(this.ticketController))
    );

    // Get tickets for a user
    this.router.get(
      `${this.path}/user/:user_id`,
      isAuthenticated,
      useCatchErrors(this.ticketController.getUserTickets.bind(this.ticketController))
    );

    // Get tickets for an event
    this.router.get(
      `${this.path}/event/:event_id`,
      useCatchErrors(this.ticketController.getEventTickets.bind(this.ticketController))
    );

    // Check in an attendee
    this.router.post(
      `${this.path}/check-in/:attendee_id`,
      isAuthenticated,
      useCatchErrors(this.ticketController.checkInAttendee.bind(this.ticketController))
    );

    // Get event attendees
    this.router.get(
      `${this.path}/attendees/:event_id`,
      isAuthenticated,
      useCatchErrors(this.ticketController.getEventAttendees.bind(this.ticketController))
    );
  }
}

module.exports = TicketRoute;