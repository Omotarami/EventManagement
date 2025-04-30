const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AgendaController {
  async createAgenda(req, res) {
    const {
      event_id,
      name,
      description,
      speakers,
      time
    } = req.body;

    if (!event_id || !name || !time) {
      return res.status(400).json({ 
        message: "Missing required fields: event_id, name, and time are required" 
      });
    }

    try {
      const agenda = await prisma.agenda.create({
        data: {
          event_id: parseInt(event_id),
          name,
          description,
          speakers,
          time
        },
      });

      res.status(201).json({ message: "Agenda created successfully", data: agenda });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the agenda" });
    }
  }

  async updateAgenda(req, res) {
    const { id } = req.params;
    const {
      name,
      description,
      speakers,
      time
    } = req.body;

    try {
      const existingAgenda = await prisma.agenda.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingAgenda) {
        return res.status(404).json({ message: "Agenda not found" });
      }

      const updatedAgenda = await prisma.agenda.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          speakers,
          time
        },
      });

      res.status(200).json({ message: "Agenda updated successfully", data: updatedAgenda });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the agenda" });
    }
  }

  async deleteAgenda(req, res) {
    const { id } = req.params;

    try {
      const existingAgenda = await prisma.agenda.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingAgenda) {
        return res.status(404).json({ message: "Agenda not found" });
      }

      await prisma.agenda.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({ message: "Agenda deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the agenda" });
    }
  }

  async getAgendaById(req, res) {
    const { id } = req.params;

    try {
      const agenda = await prisma.agenda.findUnique({
        where: { id: parseInt(id) }
      });

      if (!agenda) {
        return res.status(404).json({ message: "Agenda not found" });
      }

      res.status(200).json({ message: "Agenda retrieved successfully", data: agenda });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching the agenda" });
    }
  }

  async getAgendasByEventId(req, res) {
    const { event_id } = req.params;

    try {
      const agendas = await prisma.agenda.findMany({
        where: { event_id: parseInt(event_id) }
      });

      res.status(200).json({ message: "Agendas retrieved successfully", data: agendas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching agendas" });
    }
  }

  async getAllAgendas(req, res) {
    try {
      const agendas = await prisma.agenda.findMany();
      res.status(200).json({ message: "Agendas retrieved successfully", data: agendas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching agendas" });
    }
  }
}

module.exports = AgendaController;