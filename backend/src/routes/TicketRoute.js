const express = require("express");
const TicketController = require("../controller/TicketController");
const { isAuthenticated } = require("../middlewares/auth");

class TicketRoute {
    router = express.Router();
    ticketController = new TicketController();
    path = "/ticket";

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Get all tickets for an event
        this.router.get(
            `${this.path}/event/:event_id`,
            this.ticketController.getEventTickets.bind(this.ticketController)
        );
        
        // Purchase a ticket
        this.router.post(
            `${this.path}/purchase`,
            isAuthenticated,
            this.ticketController.purchaseTicket.bind(this.ticketController)
        );
        
        // Get user tickets
        this.router.get(
            `${this.path}/user/:user_id`,
            isAuthenticated,
            this.ticketController.getUserTickets.bind(this.ticketController)
        );
        
        // Get event attendees
        this.router.get(
            `${this.path}/attendees/:event_id`,
            isAuthenticated,
            this.ticketController.getEventAttendees.bind(this.ticketController)
        );
        
        // Check in attendee
        this.router.post(
            `${this.path}/check-in/:attendee_id`,
            isAuthenticated,
            this.ticketController.checkInAttendee.bind(this.ticketController)
        );
    }
}

module.exports = TicketRoute;