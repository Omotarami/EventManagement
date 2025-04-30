const express = require("express");
const AgendaController = require("../controller/agenda");
const useCatchErrors = require("../error/catchErrors");

class AgendaRoute {
  router = express.Router();
  agendaController = new AgendaController();

  path = "/agenda";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      useCatchErrors(this.agendaController.createAgenda)
    );
    this.router.put(
      `${this.path}/update/:id`,
      useCatchErrors(this.agendaController.updateAgenda)
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      useCatchErrors(this.agendaController.deleteAgenda)
    );
    this.router.get(
      `${this.path}/:id`,
      useCatchErrors(this.agendaController.getAgendaById)
    );
    this.router.get(
      `${this.path}/event/:event_id`,
      useCatchErrors(this.agendaController.getAgendasByEventId)
    );
    this.router.get(
      `${this.path}/all`,
      useCatchErrors(this.agendaController.getAllAgendas)
    );
  }
}

module.exports = AgendaRoute;