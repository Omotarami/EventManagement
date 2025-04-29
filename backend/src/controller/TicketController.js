const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

class TicketController {
  // Purchase a ticket
  async purchaseTicket(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    const { eventId, ticketId, quantity, unitPrice, totalAmount } = req.body;
    const userId = req.user.id; // From auth middleware

    try {
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Generate a unique order number
        const orderNumber = 'ORD-' + uuidv4().substring(0, 8);
        
        // Create the order
        const order = await prisma.order.create({
          data: {
            user_id: userId,
            event_id: parseInt(eventId),
            order_number: orderNumber,
            total_price: totalAmount,
            status: 'completed',
          }
        });
        
        // Create the order item with proper type checking
        const orderItem = await prisma.orderItem.create({
          data: {
            order_id: order.id,
            ticket_id: ticketId ? parseInt(ticketId) : null,
            quantity: parseInt(quantity) || 1,
            unit_price: parseFloat(unitPrice) || 0,
            total_price: parseFloat(totalAmount) || 0
          }
        });
        
        // Add the user as an attendee to the event
        const attendee = await prisma.attendee.create({
          data: {
            user_id: userId,
            event_id: parseInt(eventId),
            ticket_id: ticketId ? parseInt(ticketId) : null,
          }
        });
        
        // Get ticket details for the response
        let ticketDetails = null;
        if (ticketId) {
          ticketDetails = await prisma.ticket.findUnique({
            where: { id: parseInt(ticketId) },
            include: {
              event: {
                select: {
                  title: true,
                  schedule_details: true,
                  images: {
                    take: 1,
                    select: {
                      image_url: true
                    }
                  },
                  schedules: {
                    take: 1
                  }
                }
              }
            }
          });
        }
        
        // Get user details
        const userDetails = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            fullname: true,
            email: true
          }
        });
        
        // Get event details if ticketDetails couldn't be retrieved
        let eventDetails = null;
        if (!ticketDetails) {
          eventDetails = await prisma.event.findUnique({
            where: { id: parseInt(eventId) },
            select: {
              title: true,
              schedule_details: true,
              images: {
                take: 1,
                select: {
                  image_url: true
                }
              },
              schedules: {
                take: 1
              }
            }
          });
        }

        return {
          order,
          orderItem,
          attendee,
          ticketDetails,
          eventDetails,
          userDetails
        };
      });

      // Format response data
      const responseData = {
        id: result.orderItem.id,
        orderId: result.order.order_number,
        eventId: result.order.event_id,
        eventTitle: result.ticketDetails?.event?.title || result.eventDetails?.title || 'Event',
        eventDate: result.ticketDetails?.event?.schedule_details || result.eventDetails?.schedule_details || new Date().toISOString(),
        eventLocation: result.ticketDetails?.event?.schedules?.[0]?.location_details || 
                      result.eventDetails?.schedules?.[0]?.location_details || 
                      "Venue",
        eventImage: result.ticketDetails?.event?.images?.[0]?.image_url || 
                   result.eventDetails?.images?.[0]?.image_url || 
                   null,
        userId: result.order.user_id,
        userName: result.userDetails.fullname,
        userEmail: result.userDetails.email,
        ticketType: result.ticketDetails?.ticket_name || 'General Admission',
        price: result.orderItem.unit_price,
        quantity: result.orderItem.quantity,
        totalAmount: result.orderItem.total_price,
        purchaseDate: result.order.created_at,
        checkInStatus: 'not-checked-in'
      };

      res.status(201).json(responseData);
    } catch (error) {
      logger.error(`Error in purchaseTicket: ${error.message}`);
      res.status(500).json({
        message: "Failed to purchase ticket",
        error: error.message
      });
    }
  }

  // Get all tickets for the authenticated user
  async getUserTickets(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    const userId = req.user.id;

    try {
      // Get all orders for this user
      const orders = await prisma.order.findMany({
        where: {
          user_id: userId
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              schedule_details: true,
              images: {
                take: 1,
                select: {
                  image_url: true
                }
              },
              schedules: {
                take: 1,
                select: {
                  location_details: true
                }
              }
            }
          },
          orderItems: {
            include: {
              ticket: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      // Format tickets for the frontend
      const tickets = orders.flatMap(order => {
        return order.orderItems.map(item => ({
          id: item.id,
          orderId: order.order_number,
          eventId: order.event_id,
          eventTitle: order.event.title,
          eventDate: order.event.schedule_details,
          eventLocation: order.event.schedules?.[0]?.location_details || "Venue",
          eventImage: order.event.images?.[0]?.image_url || null,
          userId,
          userName: req.user.fullname || "", // Include user name from auth
          userEmail: req.user.email || "", // Include user email from auth
          ticketType: item.ticket?.ticket_name || "General Admission",
          price: item.unit_price,
          quantity: item.quantity,
          totalAmount: item.total_price,
          purchaseDate: order.created_at,
          checkInStatus: 'not-checked-in' // Default, will update below
        }));
      });

      // Get attendee records to check check-in status
      if (tickets.length > 0) {
        const attendees = await prisma.attendee.findMany({
          where: {
            user_id: userId,
            event_id: {
              in: tickets.map(t => t.eventId)
            }
          },
          select: {
            event_id: true,
            comment: true  // We'll use this to store check-in status
          }
        });

        // Update check-in status where available
        tickets.forEach(ticket => {
          const attendee = attendees.find(a => a.event_id === ticket.eventId);
          if (attendee && attendee.comment === 'checked-in') {
            ticket.checkInStatus = 'checked-in';
          }
        });
      }

      res.status(200).json(tickets);
    } catch (error) {
      logger.error(`Error in getUserTickets: ${error.message}`);
      res.status(500).json({
        message: "Failed to retrieve tickets",
        error: error.message
      });
    }
  }

  // Get a specific ticket by ID
  async getTicketById(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    const { id } = req.params;
    
    // Validate that id is a number
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        message: "Invalid ticket ID provided"
      });
    }

    try {
      const ticketId = parseInt(id);
      
      // Find the order item instead of directly finding the ticket
      const orderItem = await prisma.orderItem.findUnique({
        where: {
          id: ticketId
        },
        include: {
          ticket: true,
          order: {
            include: {
              event: {
                select: {
                  title: true,
                  schedule_details: true,
                  images: {
                    take: 1,
                    select: {
                      image_url: true
                    }
                  },
                  schedules: {
                    take: 1
                  }
                }
              },
              user: {
                select: {
                  id: true,
                  fullname: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!orderItem) {
        return res.status(404).json({
          message: "Ticket not found"
        });
      }

      // Format the ticket for the response
      const ticketResponse = {
        id: orderItem.id,
        orderId: orderItem.order.order_number,
        eventId: orderItem.order.event_id,
        eventTitle: orderItem.order.event.title,
        eventDate: orderItem.order.event.schedule_details,
        eventLocation: orderItem.order.event.schedules?.[0]?.location_details || "Venue",
        eventImage: orderItem.order.event.images?.[0]?.image_url || null,
        userId: orderItem.order.user_id,
        userName: orderItem.order.user.fullname,
        userEmail: orderItem.order.user.email,
        ticketType: orderItem.ticket?.ticket_name || "General Admission",
        price: orderItem.unit_price,
        quantity: orderItem.quantity,
        totalAmount: orderItem.total_price,
        purchaseDate: orderItem.order.created_at,
        checkInStatus: 'not-checked-in' // Default value
      };

      // Check if the user has checked in
      const attendee = await prisma.attendee.findFirst({
        where: {
          user_id: orderItem.order.user_id,
          event_id: orderItem.order.event_id,
          ticket_id: orderItem.ticket_id
        }
      });

      if (attendee && attendee.comment === 'checked-in') {
        ticketResponse.checkInStatus = 'checked-in';
      }

      res.status(200).json(ticketResponse);
    } catch (error) {
      logger.error(`Error in getTicketById: ${error.message}`);
      res.status(500).json({
        message: "Failed to retrieve ticket",
        error: error.message
      });
    }
  }

  // Get tickets for a specific event
  async getEventTickets(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    const { eventId } = req.params;
    
    // Validate eventId
    if (!eventId || isNaN(parseInt(eventId))) {
      return res.status(400).json({
        message: "Invalid event ID provided"
      });
    }
    
    try {
      const parsedEventId = parseInt(eventId);
      
      // Get all orders for this event
      const orders = await prisma.order.findMany({
        where: {
          event_id: parsedEventId
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true
            }
          },
          orderItems: {
            include: {
              ticket: true
            }
          }
        }
      });
      
      // Format tickets for response
      const tickets = orders.flatMap(order => {
        return order.orderItems.map(item => ({
          id: item.id,
          orderId: order.order_number,
          eventId: order.event_id,
          userId: order.user_id,
          userName: order.user.fullname,
          userEmail: order.user.email,
          ticketType: item.ticket?.ticket_name || "General Admission",
          price: item.unit_price,
          quantity: item.quantity,
          totalAmount: item.total_price,
          purchaseDate: order.created_at
        }));
      });
      
      res.status(200).json(tickets);
    } catch (error) {
      logger.error(`Error in getEventTickets: ${error.message}`);
      res.status(500).json({
        message: "Failed to retrieve event tickets",
        error: error.message
      });
    }
  }

  // Get attendees for an event (for messaging purposes)
  async getEventAttendees(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    const { eventId } = req.params;
    const { filter } = req.query;
    
    // Validate eventId
    if (!eventId || isNaN(parseInt(eventId))) {
      return res.status(400).json({
        message: "Invalid event ID provided"
      });
    }
    
    try {
      const parsedEventId = parseInt(eventId);
      const attendees = await prisma.attendee.findMany({
        where: {
          event_id: parsedEventId,
          // Only include users with public profiles if filter is specified
          ...(filter === 'public' ? {
            user: {
              profile_visibility: 'public'
            }
          } : {})
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              profile_picture: true,
              profile_visibility: true
            }
          },
          ticket: {
            select: {
              ticket_name: true
            }
          }
        }
      });

      // Format for frontend
      const formattedAttendees = attendees.map(attendee => ({
        id: attendee.user.id,
        fullname: attendee.user.fullname,
        profilePicture: attendee.user.profile_picture,
        ticketType: attendee.ticket?.ticket_name || 'General Admission',
        profileVisibility: attendee.user.profile_visibility
      }));

      res.status(200).json(formattedAttendees);
    } catch (error) {
      logger.error(`Error in getEventAttendees: ${error.message}`);
      res.status(500).json({
        message: "Failed to retrieve event attendees",
        error: error.message
      });
    }
  }

  // Check in a ticket
  async checkInTicket(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    const { ticketId } = req.params;
    const userId = req.user.id;
    
    // Validate ticketId
    if (!ticketId || isNaN(parseInt(ticketId))) {
      return res.status(400).json({
        message: "Invalid ticket ID provided"
      });
    }
    
    try {
      const parsedTicketId = parseInt(ticketId);
      
      // Find the order item
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: parsedTicketId },
        include: {
          order: true,
          ticket: true
        }
      });
      
      if (!orderItem) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Verify this ticket belongs to the authenticated user
      if (orderItem.order.user_id !== userId) {
        return res.status(403).json({ message: "Not authorized to check in this ticket" });
      }
      
      // Find attendee record
      const attendee = await prisma.attendee.findFirst({
        where: {
          user_id: userId,
          event_id: orderItem.order.event_id,
          ticket_id: orderItem.ticket_id
        }
      });
      
      if (!attendee) {
        // Create attendee record if it doesn't exist
        await prisma.attendee.create({
          data: {
            user_id: userId,
            event_id: orderItem.order.event_id,
            ticket_id: orderItem.ticket_id,
            comment: 'checked-in'
          }
        });
      } else {
        // Update existing attendee record
        await prisma.attendee.update({
          where: { id: attendee.id },
          data: { comment: 'checked-in' }
        });
      }
      
      res.status(200).json({
        ticketId: parsedTicketId,
        eventId: orderItem.order.event_id,
        checkedIn: true,
        checkedInAt: new Date()
      });
    } catch (error) {
      logger.error(`Error in checkInTicket: ${error.message}`);
      res.status(500).json({
        message: "Failed to check in ticket",
        error: error.message
      });
    }
  }

  // Verify a ticket (for event organizers/staff)
  async verifyTicket(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    const { ticketId } = req.params;
    const { verificationCode } = req.body;
    const organizerId = req.user.id;
    
    // Validate ticketId
    if (!ticketId || isNaN(parseInt(ticketId))) {
      return res.status(400).json({
        message: "Invalid ticket ID provided"
      });
    }
    
    try {
      const parsedTicketId = parseInt(ticketId);
      
      // Find the order item
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: parsedTicketId },
        include: {
          order: {
            include: {
              event: true
            }
          },
          ticket: true
        }
      });
      
      if (!orderItem) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Verify this organizer owns the event
      if (orderItem.order.event.user_id !== organizerId) {
        return res.status(403).json({ message: "Not authorized to verify tickets for this event" });
      }
      
      // Find attendee record
      const attendee = await prisma.attendee.findFirst({
        where: {
          user_id: orderItem.order.user_id,
          event_id: orderItem.order.event_id,
          ticket_id: orderItem.ticket_id
        }
      });
      
      if (!attendee) {
        // Create attendee record if it doesn't exist
        await prisma.attendee.create({
          data: {
            user_id: orderItem.order.user_id,
            event_id: orderItem.order.event_id,
            ticket_id: orderItem.ticket_id,
            comment: 'checked-in'
          }
        });
      } else {
        // Update existing attendee record
        await prisma.attendee.update({
          where: { id: attendee.id },
          data: { comment: 'checked-in' }
        });
      }
      
      res.status(200).json({
        ticketId: parsedTicketId,
        eventId: orderItem.order.event_id,
        userId: orderItem.order.user_id,
        ticketType: orderItem.ticket?.ticket_name || "General Admission",
        verified: true,
        verifiedAt: new Date()
      });
    } catch (error) {
      logger.error(`Error in verifyTicket: ${error.message}`);
      res.status(500).json({
        message: "Failed to verify ticket",
        error: error.message
      });
    }
  }

  // Cancel a ticket
  async cancelTicket(req, res) {
    // Skip for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    const { ticketId } = req.params;
    const userId = req.user.id;
    
    // Validate ticketId
    if (!ticketId || isNaN(parseInt(ticketId))) {
      return res.status(400).json({
        message: "Invalid ticket ID provided"
      });
    }
    
    try {
      const parsedTicketId = parseInt(ticketId);
      
      // Find the order item
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: parsedTicketId },
        include: {
          order: true
        }
      });
      
      if (!orderItem) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Verify this ticket belongs to the authenticated user
      if (orderItem.order.user_id !== userId) {
        return res.status(403).json({ message: "Not authorized to cancel this ticket" });
      }
      
      // Update order status
      await prisma.order.update({
        where: { id: orderItem.order.id },
        data: { status: 'cancelled' }
      });
      
      // Remove attendee record
      await prisma.attendee.deleteMany({
        where: {
          user_id: userId,
          event_id: orderItem.order.event_id,
          ticket_id: orderItem.ticket_id
        }
      });
      
      res.status(200).json({
        ticketId: parsedTicketId,
        eventId: orderItem.order.event_id,
        cancelled: true,
        cancelledAt: new Date()
      });
    } catch (error) {
      logger.error(`Error in cancelTicket: ${error.message}`);
      res.status(500).json({
        message: "Failed to cancel ticket",
        error: error.message
      });
    }
  }
}

module.exports = TicketController;