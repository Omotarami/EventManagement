const http = require("http");
const App = require("./app");
const AuthRoute = require("./routes/auth");
const EventRoute = require("./routes/event");
const CategoryRoute = require("./routes/category");
const ScheduleRoute = require("./routes/event-schedule");
const TicketRoute = require("./routes/TicketRoute");
const FavouriteRoute = require("./routes/favourite");
const ConversationRoute = require("./routes/conversation");
const { SocketServer } = require("./socket");
const logger = require("./config/logger");

// Initialize Express app
const app = new App();

// Initialize routes
app.initializedRoutes([
  new AuthRoute(),
  new EventRoute(),
  new CategoryRoute(),
  new ScheduleRoute(),
  new TicketRoute(),
  new FavouriteRoute(),
  new ConversationRoute(),
]);

// Create HTTP server
const server = http.createServer(app.app);

// Initialize Socket.IO
const socketServer = new SocketServer(server);

// Make Socket.IO instance available to Express controllers
app.setSocketIO(socketServer.io);

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Server started at http://localhost:${PORT}`);
  logger.info(`WebSocket server running on the same port`);
});
