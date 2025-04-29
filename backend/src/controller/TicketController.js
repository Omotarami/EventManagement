const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

class TicketController {
  async purchaseTicket(req, res) {
    const { event_id, user_id, ticket_id, quantity = 1 } = req.body;

    if (!event_id || !user_id || !ticket_id) {
      return res.status(400).json({
        message: "Missing required fields: event_id, user_id, and ticket_id are required",
      });
    }

    try {
      
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(ticket_id) },
        include: { event: true }
      });

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

    
      if (ticket.quantity !== null) {
       
        const ticketsSold = await prisma.orderItem.aggregate({
          where: { ticket_id: parseInt(ticket_id) },
          _sum: { quantity: true },
        });
        
        const totalSold = ticketsSold._sum.quantity || 0;
        
        if (totalSold + quantity > ticket.quantity) {
          return res.status(400).json({ 
            message: `Not enough tickets available. Only ${ticket.quantity - totalSold} remaining.` 
          });
        }
      }

      // Calculate total price
      const unitPrice = ticket.price || 0;
      const totalPrice = unitPrice * quantity;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create transaction to ensure everything happens or nothing happens
      const result = await prisma.$transaction(async (prisma) => {
        // Create the order
        const order = await prisma.order.create({
          data: {
            user_id: parseInt(user_id),
            event_id: parseInt(event_id),
            order_number: orderNumber,
            total_price: totalPrice,
            status: "completed",
          },
        });

        // Create order item
        await prisma.orderItem.create({
          data: {
            order_id: order.id,
            ticket_id: parseInt(ticket_id),
            quantity: quantity,
            unit_price: unitPrice,
            total_price: totalPrice,
          },
        });

        // Create or update attendee record
        const existingAttendee = await prisma.attendee.findFirst({
          where: {
            user_id: parseInt(user_id),
            event_id: parseInt(event_id),
          },
        });

        if (!existingAttendee) {
          await prisma.attendee.create({
            data: {
              user_id: parseInt(user_id),
              event_id: parseInt(event_id),
              ticket_id: parseInt(ticket_id),
            },
          });
        } else {
          await prisma.attendee.update({
            where: { id: existingAttendee.id },
            data: { ticket_id: parseInt(ticket_id) },
          });
        }

        return { order, ticket };
      });

      res.status(201).json({
        message: "Ticket purchased successfully",
        data: {
          order_id: result.order.id,
          order_number: result.order.order_number,
          ticket_type: result.ticket.ticket_name,
          quantity: quantity,
          unit_price: result.ticket.price,
          total_price: result.order.total_price,
          event_title: result.ticket.event.title,
        },
      });
    } catch (error) {
      logger.error(`Error in purchaseTicket: ${error.message}`);
      console.error("Full error:", error);
      res.status(500).json({
        message: "An error occurred while purchasing ticket",
        details: error.message,
      });
    }
  }

  async getUserTickets(req, res) {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing required parameter: user_id",
      });
    }

    try {
      const orders = await prisma.order.findMany({
        where: {
          user_id: parseInt(user_id),
          status: "completed", 
        },
        include: {
          event: {
            include: {
              images: true,
            },
          },
          orderItems: {
            include: {
              ticket: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      // Transform the data to a more usable format for the frontend
      const userTickets = orders.flatMap(order => {
        return order.orderItems.map(item => {
          return {
            id: `${order.id}-${item.id}`,
            orderId: order.order_number,
            eventId: order.event_id,
            eventTitle: order.event.title,
            // Use the first image if available
            eventImage: order.event.images && order.event.images.length > 0 
              ? order.event.images[0].image_url 
              : null,
            userId: order.user_id,
            ticketId: item.ticket_id,
            ticketType: item.ticket.ticket_name,
            price: item.unit_price,
            quantity: item.quantity,
            totalAmount: item.total_price,
            purchaseDate: order.id.toString(), 
            status: order.status,
            
            checkInStatus: "not-checked-in" 
          };
        });
      });

      res.status(200).json({
        message: "User tickets retrieved successfully",
        data: userTickets
      });
    } catch (error) {
      logger.error(`Error in getUserTickets: ${error.message}`);
      res.status(500).json({
        message: "An error occurred while retrieving user tickets",
        details: error.message,
      });
    }
  }

  async getEventTickets(req, res) {
    const { event_id } = req.params;

    if (!event_id) {
      return res.status(400).json({
        message: "Missing required parameter: event_id",
      });
    }

    try {
      // Get all tickets for this event
      const tickets = await prisma.ticket.findMany({
        where: {
          event_id: parseInt(event_id),
        },
      });

      // Get attendee count for each ticket
      const ticketsWithStats = await Promise.all(
        tickets.map(async (ticket) => {
          const itemsCount = await prisma.orderItem.aggregate({
            where: {
              ticket_id: ticket.id,
              order: {
                status: "completed",
              },
            },
            _sum: { quantity: true },
          });

          return {
            ...ticket,
            sold: itemsCount._sum.quantity || 0,
            available: ticket.quantity !== null 
              ? ticket.quantity - (itemsCount._sum.quantity || 0) 
              : null, // null means unlimited
          };
        })
      );

      res.status(200).json({
        message: "Event tickets retrieved successfully",
        data: ticketsWithStats,
      });
    } catch (error) {
      logger.error(`Error in getEventTickets: ${error.message}`);
      res.status(500).json({
        message: "An error occurred while retrieving event tickets",
        details: error.message,
      });
    }
  }

  async checkInAttendee(req, res) {
    const { attendee_id } = req.params;
    const { check_in = true } = req.body;

    if (!attendee_id) {
      return res.status(400).json({
        message: "Missing required parameter: attendee_id",
      });
    }

    try {
      // Update the attendee record
      const attendee = await prisma.attendee.update({
        where: { id: parseInt(attendee_id) },
        data: {
          // Set or unset check-in time based on check_in parameter
          comment: check_in ? "checked-in" : null,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
            },
          },
          ticket: true,
        },
      });

      res.status(200).json({
        message: check_in ? "Attendee checked in successfully" : "Attendee check-in reverted",
        data: {
          attendeeId: attendee.id,
          userId: attendee.user_id,
          userName: attendee.user.fullname,
          userEmail: attendee.user.email,
          eventId: attendee.event_id,
          eventTitle: attendee.event.title,
          ticketType: attendee.ticket ? attendee.ticket.ticket_name : null,
          checkInStatus: check_in ? "checked-in" : "not-checked-in",
          checkInTime: check_in ? new Date() : null,
        },
      });
    } catch (error) {
      logger.error(`Error in checkInAttendee: ${error.message}`);
      res.status(500).json({
        message: "An error occurred while updating attendee check-in status",
        details: error.message,
      });
    }
  }

  async getEventAttendees(req, res) {
    const { event_id } = req.params;

    if (!event_id) {
      return res.status(400).json({
        message: "Missing required parameter: event_id",
      });
    }

    try {
      // Get all attendees for this event with related data
      const attendees = await prisma.attendee.findMany({
        where: {
          event_id: parseInt(event_id),
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
              profile_picture: true,
            },
          },
          ticket: true,
        },
      });

      // Transform to more usable format for frontend
      const attendeeList = attendees.map(attendee => {
        return {
          id: attendee.id,
          userId: attendee.user_id,
          name: attendee.user.fullname,
          email: attendee.user.email,
          profilePicture: attendee.user.profile_picture,
          ticketId: attendee.ticket_id,
          ticketType: attendee.ticket ? attendee.ticket.ticket_name : null,
          ticketPrice: attendee.ticket ? attendee.ticket.price : null,
          checkInStatus: attendee.comment === "checked-in" ? "checked-in" : "not-checked-in"
        };
      });

      res.status(200).json({
        message: "Event attendees retrieved successfully",
        data: attendeeList,
      });
    } catch (error) {
      logger.error(`Error in getEventAttendees: ${error.message}`);
      res.status(500).json({
        message: "An error occurred while retrieving event attendees",
        details: error.message,
      });
    }
  }
}

module.exports = TicketController;