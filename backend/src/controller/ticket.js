const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TicketController {
  async createTicket(req, res) {
    const {
      event_id,
      ticket_type,
      ticket_name,
      is_free = false,
      description,
      price,
      quantity
    } = req.body;

    if (!event_id || !ticket_type || !ticket_name) {
      return res.status(400).json({ 
        message: "Missing required fields: event_id, ticket_type, and ticket_name are required" 
      });
    }

    try {
      // Validate price for paid tickets
      if (!is_free && (price === undefined || price === null || price < 0)) {
        return res.status(400).json({ 
          message: "Price is required for paid tickets and must be a positive number" 
        });
      }

      // Validate quantity
      if (quantity !== undefined && quantity < 0) {
        return res.status(400).json({ 
          message: "Quantity must be a positive number" 
        });
      }

      const ticket = await prisma.ticket.create({
        data: {
          event_id: parseInt(event_id),
          ticket_type,
          ticket_name,
          is_free,
          description,
          price: is_free ? 0 : parseFloat(price),
          quantity: quantity ? parseInt(quantity) : null
        },
      });

      res.status(201).json({ message: "Ticket created successfully", data: ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the ticket" });
    }
  }

  async updateTicket(req, res) {
    const { id } = req.params;
    const {
      ticket_type,
      ticket_name,
      is_free,
      description,
      price,
      quantity
    } = req.body;

    try {
      const existingTicket = await prisma.ticket.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Validate price for paid tickets
      if (!is_free && (price === undefined || price === null || price < 0)) {
        return res.status(400).json({ 
          message: "Price is required for paid tickets and must be a positive number" 
        });
      }

      // Validate quantity
      if (quantity !== undefined && quantity < 0) {
        return res.status(400).json({ 
          message: "Quantity must be a positive number" 
        });
      }

      const updatedTicket = await prisma.ticket.update({
        where: { id: parseInt(id) },
        data: {
          ticket_type,
          ticket_name,
          is_free,
          description,
          price: is_free ? 0 : parseFloat(price),
          quantity: quantity ? parseInt(quantity) : null
        },
      });

      res.status(200).json({ message: "Ticket updated successfully", data: updatedTicket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the ticket" });
    }
  }

  async deleteTicket(req, res) {
    const { id } = req.params;

    try {
      const existingTicket = await prisma.ticket.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      await prisma.ticket.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the ticket" });
    }
  }

  async getTicketById(req, res) {
    const { id } = req.params;

    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(id) }
      });

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.status(200).json({ message: "Ticket retrieved successfully", data: ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching the ticket" });
    }
  }

  async getTicketsByEventId(req, res) {
    const { event_id } = req.params;

    try {
      const tickets = await prisma.ticket.findMany({
        where: { event_id: parseInt(event_id) }
      });

      res.status(200).json({ message: "Tickets retrieved successfully", data: tickets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching tickets" });
    }
  }

  async getAllTickets(req, res) {
    try {
      const tickets = await prisma.ticket.findMany();
      res.status(200).json({ message: "Tickets retrieved successfully", data: tickets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching tickets" });
    }
  }
}

module.exports = TicketController;