const express = require("express");
const useCatchErrors = require("../error/catchErrors");
const EventController = require("../controller/event");
const multer = require("multer");

class EventRoute {
  router = express.Router();
  eventController = new EventController();
  path = "/event";

  
  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/events/'); 
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      // Accept image files only
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  });

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
   
    this.router.post(
      `${this.path}/create`,
      this.upload.array('images', 5), 
      useCatchErrors(this.handleEventCreation.bind(this))
    );

    // Update an existing event
    this.router.put(
      `${this.path}/update/:id`,
      useCatchErrors(this.eventController.updateEvent)
    );

    // Delete an event
    this.router.delete(
      `${this.path}/delete/:id`,
      useCatchErrors(this.eventController.deleteEvent)
    );

    // Get an event by ID
    this.router.get(
      `${this.path}/detail/:id`,
      useCatchErrors(this.eventController.getEventById)
    );

    // Get events by user ID
    this.router.get(
      `${this.path}/user/:user_id`,
      useCatchErrors(this.eventController.getEventsByUserId)
    );

    // Get all events
    this.router.get(
      `${this.path}/all`,
      useCatchErrors(this.eventController.getAllEvents)
    );
  }

  // Custom handler to process multi-part form data
  async handleEventCreation(req, res) {
    // Prepare event data from request body
    const eventData = {
      user_id: parseInt(req.body.user_id),
      title: req.body.title,
      description: req.body.description,
      schedule_type: req.body.schedule_type || 'one-time',
      category: req.body.category,
      capacity: req.body.capacity,
      
      // Process uploaded images
      images: req.files ? req.files.map(file => ({
        url: `/uploads/events/${file.filename}`,
        description: req.body.image_descriptions ? 
          JSON.parse(req.body.image_descriptions)[req.files.indexOf(file)] : 
          null
      })) : [],

      // Parse additional data if provided as JSON strings
      schedules: req.body.schedules ? JSON.parse(req.body.schedules) : [],
      agendas: req.body.agendas ? JSON.parse(req.body.agendas) : [],
      tickets: req.body.tickets ? JSON.parse(req.body.tickets) : []
    };

    // Use the full event creation method
    await this.eventController.createFullEvent({ body: eventData }, res);
  }

  async createEvent(req, res) {
    try {
      // Log all incoming request data
      console.log('Incoming Request Body:', req.body);
      console.log('Incoming Files:', req.files);
  
      // Validate required fields
      const requiredFields = ['title', 'description', 'category'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
  
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}`,
          requiredFields
        });
      }
  
      // Rest of your existing code...
    } catch (error) {
      console.error("Detailed Event Creation Error:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ 
        message: "Failed to create event",
        error: error.message,
        // Optionally include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }
}



module.exports = EventRoute;