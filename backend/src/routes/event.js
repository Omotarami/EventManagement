const express = require("express");
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const { isAuthenticated } = require("../middlewares/auth");

class EventRoute {
  router = express.Router();
  prisma = new PrismaClient();

  // Configure multer for file uploads
  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/events'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `event-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
      }
    }
  });

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new event (with optional file uploads)
    this.router.post(
      "/event/create", 
      isAuthenticated,
      this.upload.array('images', 5),
      this.createEvent.bind(this)
    );

    // Get all events
    this.router.get(
      "/event/all", 
      isAuthenticated,
      this.getAllEvents.bind(this)
    );

    // Get events for a specific user
    this.router.get(
      "/event/user/:userId", 
      isAuthenticated,
      this.getUserEvents.bind(this)
    );

    // Get a specific event by ID
    this.router.get(
      "/event/detail/:id", 
      isAuthenticated,
      this.getEventById.bind(this)
    );

    // Update an event
    this.router.put(
      "/event/update/:id", 
      isAuthenticated,
      this.updateEvent.bind(this)
    );

    // Delete an event
    this.router.delete(
      "/event/delete/:id", 
      isAuthenticated,
      this.deleteEvent.bind(this)
    );
  }

  // Create a new event
  async createEvent(req, res) {
    try {
      const {
        title,
        description,
        schedule_type = "one-time",
        category,
        capacity,
        schedules = [],
        agendas = [],
        tickets = []
      } = req.body;

      // Ensure user ID is taken from authenticated user
      const userId = req.user.id;

      // Start a transaction to ensure data consistency
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the main event
        const event = await prisma.event.create({
          data: {
            user_id: userId,
            title,
            description,
            schedule_type,
            category,
            capacity
          }
        });

        // Process and create event images
        if (req.files && req.files.length > 0) {
          await prisma.eventImage.createMany({
            data: req.files.map(file => ({
              event_id: event.id,
              image_url: `/uploads/events/${file.filename}`,
              description: null
            }))
          });
        }

        // Create event schedules
        if (schedules && schedules.length > 0) {
          await prisma.eventSchedule.createMany({
            data: schedules.map(schedule => ({
              event_id: event.id,
              day: schedule.day,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              location_type: schedule.location_type,
              location_details: schedule.location_details,
              comment: schedule.comment || null
            }))
          });
        }

        // Create event agendas
        if (agendas && agendas.length > 0) {
          await prisma.eventAgenda.createMany({
            data: agendas.map(agenda => ({
              event_id: event.id,
              name: agenda.name,
              description: agenda.description || null,
              speakers: agenda.speakers ? JSON.stringify(agenda.speakers) : null,
              time: agenda.time || null
            }))
          });
        }

        // Create tickets
        if (tickets && tickets.length > 0) {
          await prisma.ticket.createMany({
            data: tickets.map(ticket => ({
              event_id: event.id,
              ticket_type: ticket.type || 'standard',
              ticket_name: ticket.name,
              is_free: ticket.type === 'free',
              description: ticket.description || null,
              price: ticket.type === 'paid' ? parseFloat(ticket.price) : null,
              quantity: parseInt(ticket.quantity) || null
            }))
          });
        }

        return event;
      });

      res.status(201).json({
        message: "Event created successfully",
        event: result
      });
    } catch (error) {
      console.error("Event creation error:", error);
      res.status(500).json({ 
        message: "Failed to create event",
        error: error.message 
      });
    }
  }

  // Get all events
  async getAllEvents(req, res) {
    try {
      const events = await this.prisma.event.findMany({
        include: {
          images: true,
          tickets: true
        }
      });
      res.status(200).json(events);
    } catch (error) {
      console.error("Get all events error:", error);
      res.status(500).json({ 
        message: "Failed to fetch events",
        error: error.message 
      });
    }
  }

  // Get events for a specific user
  async getUserEvents(req, res) {
    try {
      const { userId } = req.params;
      const events = await this.prisma.event.findMany({
        where: { user_id: parseInt(userId) },
        include: {
          images: true,
          tickets: true
        }
      });
      res.status(200).json(events);
    } catch (error) {
      console.error("Get user events error:", error);
      res.status(500).json({ 
        message: "Failed to fetch user events",
        error: error.message 
      });
    }
  }

  // Get a specific event by ID
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await this.prisma.event.findUnique({
        where: { id: parseInt(id) },
        include: {
          images: true,
          tickets: true,
          schedules: true,
          agendas: true
        }
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error("Get event by ID error:", error);
      res.status(500).json({ 
        message: "Failed to fetch event details",
        error: error.message 
      });
    }
  }

  // Update an event
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        schedule_type,
        category,
        capacity
      } = req.body;

      const updatedEvent = await this.prisma.event.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          schedule_type,
          category,
          capacity
        }
      });

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({ 
        message: "Failed to update event",
        error: error.message 
      });
    }
  }

  // Delete an event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await this.prisma.event.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ 
        message: "Failed to delete event",
        error: error.message 
      });
    }
  }
}

module.exports = EventRoute;