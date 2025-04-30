const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const TicketController = require('../controller/TicketController');

class TicketRoute {
  router = express.Router();
  ticketController = new TicketController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Purchase a ticket
    this.router.post(
      '/ticket/purchase',
      isAuthenticated,
      this.ticketController.purchaseTicket.bind(this.ticketController)
    );

    // Get user's tickets
    this.router.get(
      '/ticket/user/:user_id',
      isAuthenticated,
      this.ticketController.getUserTickets.bind(this.ticketController)
    );

    // Get event's tickets
    this.router.get(
      '/ticket/event/:event_id',
      this.ticketController.getEventTickets.bind(this.ticketController)
    );

    // Update attendee check-in status
    this.router.put(
      '/ticket/check-in/:attendee_id',
      isAuthenticated,
      this.ticketController.checkInAttendee.bind(this.ticketController)
    );
  }
}

module.exports = TicketRoute;