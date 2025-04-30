const express = require("express");
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const { isAuthenticated } = require("../middlewares/auth");

class EventRoute {
  router = express.Router();
  prisma = new PrismaClient();

  // Validation middleware for event creation
  validateEventData = (req, res, next) => {
    // Parse the body - this is crucial for multipart/form-data
    const { 
      title, 
      description, 
      category, 
      schedule_type, 
      capacity 
    } = req.body;

    const errors = [];

    // Validate title
    if (!title || title.trim() === '') {
      errors.push('Title is required and cannot be empty');
    }

    // Validate description
    if (!description || description.trim() === '') {
      errors.push('Description is required and cannot be empty');
    }

    // Validate category
    if (!category || category.trim() === '') {
      errors.push('Category is required');
    }

    // Optional: Additional validations
    if (schedule_type && !['one-time', 'recurring'].includes(schedule_type)) {
      errors.push('Invalid schedule type');
    }

    // Validate capacity (if provided)
    if (capacity) {
      const parsedCapacity = parseInt(capacity);
      if (isNaN(parsedCapacity) || parsedCapacity < 0) {
        errors.push('Capacity must be a non-negative number');
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation Failed',
        errors
      });
    }

    // If all validations pass, proceed to next middleware
    next();
  };

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
      this.validateEventData,
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
      // Log incoming request for debugging
      console.log('Incoming Request Body:', req.body);
      console.log('Incoming Files:', req.files);

      const {
        title,
        description,
        schedule_type = "one-time",
        category,
        capacity,
        schedules = '[]',
        agendas = '[]',
        tickets = '[]'
      } = req.body;

      // Parse stringified arrays (from FormData)
      let parsedSchedules = [];
      let parsedAgendas = [];
      let parsedTickets = [];

      try {
        parsedSchedules = JSON.parse(schedules);
        parsedAgendas = JSON.parse(agendas);
        parsedTickets = JSON.parse(tickets);
      } catch (parseError) {
        return res.status(400).json({
          message: 'Invalid data format',
          error: parseError.message
        });
      }

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
            capacity: capacity ? parseInt(capacity) : null
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
        if (parsedSchedules && parsedSchedules.length > 0) {
          await prisma.eventSchedule.createMany({
            data: parsedSchedules.map(schedule => ({
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
        if (parsedAgendas && parsedAgendas.length > 0) {
          await prisma.eventAgenda.createMany({
            data: parsedAgendas.map(agenda => ({
              event_id: event.id,
              name: agenda.name,
              description: agenda.description || null,
              speakers: agenda.speakers ? JSON.stringify(agenda.speakers) : null,
              time: agenda.time || null
            }))
          });
        }

        // Create tickets
        if (parsedTickets && parsedTickets.length > 0) {
          await prisma.ticket.createMany({
            data: parsedTickets.map(ticket => ({
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
      console.error("Detailed Event Creation Error:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      res.status(500).json({ 
        message: "Failed to create event",
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }
}

module.exports = EventRoute;