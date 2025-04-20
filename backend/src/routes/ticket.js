const express = require("express");
const TicketController = require("../controller/ticket");
const useCatchErrors = require("../error/catchErrors");

class TicketRoute {
  router = express.Router();
  ticketController = new TicketController();

  path = "/ticket";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      useCatchErrors(this.ticketController.createTicket)
    );
    this.router.put(
      `${this.path}/update/:id`,
      useCatchErrors(this.ticketController.updateTicket)
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      useCatchErrors(this.ticketController.deleteTicket)
    );
    this.router.get(
      `${this.path}/:id`,
      useCatchErrors(this.ticketController.getTicketById)
    );
    this.router.get(
      `${this.path}/event/:event_id`,
      useCatchErrors(this.ticketController.getTicketsByEventId)
    );
    this.router.get(
      `${this.path}/all`,
      useCatchErrors(this.ticketController.getAllTickets)
    );
  }
}

module.exports = TicketRoute;