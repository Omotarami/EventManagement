const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class EventScheduleController {
  async createEventSchedule(req, res) {
    const {
      event_id,
      day,
      start_time,
      end_time,
      comment,
      location_type,
      location_details
    } = req.body;

    if (!event_id || !day || !start_time || !end_time) {
      return res.status(400).json({ 
        message: "Missing required fields: event_id, day, start_time, and end_time are required" 
      });
    }

    try {
      const schedule = await prisma.eventSchedule.create({
        data: {
          event_id: parseInt(event_id),
          day,
          start_time,
          end_time,
          comment,
          location_type,
          location_details
        },
      });

      res.status(201).json({ message: "Event schedule created successfully", data: schedule });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the event schedule" });
    }
  }

  async updateEventSchedule(req, res) {
    const { id } = req.params;
    const {
      day,
      start_time,
      end_time,
      comment,
      location_type,
      location_details
    } = req.body;

    try {
      const existingSchedule = await prisma.eventSchedule.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingSchedule) {
        return res.status(404).json({ message: "Event schedule not found" });
      }

      const updatedSchedule = await prisma.eventSchedule.update({
        where: { id: parseInt(id) },
        data: {
          day,
          start_time,
          end_time,
          comment,
          location_type,
          location_details
        },
      });

      res.status(200).json({ message: "Event schedule updated successfully", data: updatedSchedule });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the event schedule" });
    }
  }

  async deleteEventSchedule(req, res) {
    const { id } = req.params;

    try {
      const existingSchedule = await prisma.eventSchedule.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingSchedule) {
        return res.status(404).json({ message: "Event schedule not found" });
      }

      await prisma.eventSchedule.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({ message: "Event schedule deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the event schedule" });
    }
  }

  async getScheduleById(req, res) {
    const { id } = req.params;

    try {
      const schedule = await prisma.eventSchedule.findUnique({
        where: { id: parseInt(id) }
      });

      if (!schedule) {
        return res.status(404).json({ message: "Event schedule not found" });
      }

      res.status(200).json({ message: "Event schedule retrieved successfully", data: schedule });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching the event schedule" });
    }
  }

  async getSchedulesByEventId(req, res) {
    const { event_id } = req.params;

    try {
      const schedules = await prisma.eventSchedule.findMany({
        where: { event_id: parseInt(event_id) }
      });

      res.status(200).json({ message: "Event schedules retrieved successfully", data: schedules });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching event schedules" });
    }
  }

  async getAllSchedules(req, res) {
    try {
      const schedules = await prisma.eventSchedule.findMany();
      res.status(200).json({ message: "Event schedules retrieved successfully", data: schedules });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching event schedules" });
    }
  }
}

module.exports = EventScheduleController;