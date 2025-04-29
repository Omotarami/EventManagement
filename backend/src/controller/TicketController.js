const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TicketController {
  async purchaseTicket(req, res) {
    const { user_id, event_id, ticket_id, quantity = 1 } = req.body;

    // Validate required fields
    if (!user_id || !event_id || !ticket_id) {
      return res.status(400).json({ 
        error: "Missing required fields: user_id, event_id, and ticket_id are required" 
      });
    }

    try {
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Get ticket information
        const ticket = await prisma.ticket.findUnique({
          where: { id: parseInt(ticket_id) },
          include: { event: true }
        });

        if (!ticket) {
          throw new Error("Ticket not found");
        }

        // Check if ticket is available
        if (ticket.quantity !== null) {
          const ticketsSold = await prisma.orderItem.aggregate({
            where: { ticket_id: parseInt(ticket_id) },
            _sum: { quantity: true }
          });
          
          const soldCount = ticketsSold._sum.quantity || 0;
          if (soldCount + quantity > ticket.quantity) {
            throw new Error("Not enough tickets available");
          }
        }

        // Calculate prices
        const unitPrice = ticket.price || 0;
        const totalPrice = unitPrice * quantity;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create order
        const order = await prisma.order.create({
          data: {
            user_id: parseInt(user_id),
            event_id: parseInt(event_id),
            order_number: orderNumber,
            total_price: totalPrice,
            status: "completed",
            orderItems: {
              create: {
                ticket_id: parseInt(ticket_id),
                quantity: quantity,
                unit_price: unitPrice,
                total_price: totalPrice
              }
            }
          },
          include: {
            orderItems: true
          }
        });

        // Create attendee record
        const attendee = await prisma.attendee.create({
          data: {
            user_id: parseInt(user_id),
            event_id: parseInt(event_id),
            ticket_id: parseInt(ticket_id),
            comment: `Purchased ${quantity} ticket(s) via order ${orderNumber}`
          }
        });

        return { order, attendee, ticket };
      });

      // Return success response
      res.status(201).json({
        message: "Ticket purchased successfully",
        order: result.order,
        ticket: result.ticket
      });
    } catch (error) {
      console.error("Ticket purchase error:", error);
      res.status(500).json({ 
        error: "An error occurred while purchasing the ticket",
        details: error.message 
      });
    }
  }

  async getUserTickets(req, res) {
    try {
      const { user_id } = req.params;

      const attendees = await prisma.attendee.findMany({
        where: { user_id: parseInt(user_id) },
        include: {
          event: {
            include: {
              images: true
            }
          },
          ticket: true,
          user: {
            select: {
              fullname: true,
              email: true
            }
          }
        }
      });

      const tickets = await Promise.all(attendees.map(async (attendee) => {
        // Get the order for this ticket
        const orderItem = await prisma.orderItem.findFirst({
          where: { 
            ticket_id: attendee.ticket_id,
            order: {
              user_id: parseInt(user_id),
              event_id: attendee.event_id
            }
          },
          include: {
            order: true
          }
        });

        return {
          id: attendee.id,
          eventId: attendee.event_id,
          eventTitle: attendee.event.title,
          eventDate: attendee.event.schedules?.[0]?.day || null,
          eventTime: attendee.event.schedules?.[0]?.start_time || null,
          eventLocation: attendee.event.schedules?.[0]?.location_details || null,
          eventImage: attendee.event.images?.[0]?.image_url || null,
          ticketId: attendee.ticket_id,
          ticketType: attendee.ticket.ticket_name,
          price: attendee.ticket.price,
          quantity: orderItem?.quantity || 1,
          totalAmount: orderItem?.total_price || attendee.ticket.price,
          purchaseDate: orderItem?.order?.created_at || new Date(),
          orderId: orderItem?.order?.order_number || 'N/A',
          checkInStatus: 'not-checked-in',
          userId: attendee.user_id,
          userName: attendee.user.fullname,
          userEmail: attendee.user.email
        };
      }));

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Get user tickets error:", error);
      res.status(500).json({ 
        error: "An error occurred while fetching user tickets",
        details: error.message 
      });
    }
  }

  async getEventTickets(req, res) {
    try {
      const { event_id } = req.params;

      const tickets = await prisma.ticket.findMany({
        where: { event_id: parseInt(event_id) },
        include: {
          orderItems: true
        }
      });

      // Calculate tickets sold for each ticket type
      const ticketsWithStats = tickets.map(ticket => {
        const sold = ticket.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          id: ticket.id,
          ticket_name: ticket.ticket_name,
          ticket_type: ticket.ticket_type,
          price: ticket.price,
          is_free: ticket.is_free,
          description: ticket.description,
          quantity: ticket.quantity,
          sold: sold
        };
      });

      res.status(200).json(ticketsWithStats);
    } catch (error) {
      console.error("Get event tickets error:", error);
      res.status(500).json({ 
        error: "An error occurred while fetching event tickets",
        details: error.message 
      });
    }
  }

  async checkInAttendee(req, res) {
    try {
      const { attendee_id } = req.params;
      const { check_in_status } = req.body;

      const attendee = await prisma.attendee.update({
        where: { id: parseInt(attendee_id) },
        data: {
          comment: check_in_status === "checked-in" 
            ? `Checked in at ${new Date().toISOString()}`
            : `Check-in status updated to ${check_in_status}`
        }
      });

      res.status(200).json({
        message: "Attendee check-in status updated",
        attendee
      });
    } catch (error) {
      console.error("Check-in error:", error);
      res.status(500).json({ 
        error: "An error occurred while updating check-in status",
        details: error.message 
      });
    }
  }
}

module.exports = TicketController;