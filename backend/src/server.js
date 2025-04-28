const App = require("./app");
// const UserRoute = require("./routes/user");
const AuthRoute = require("./routes/auth");
const EventRoute = require("./routes/event");
const CategoryRoute = require("./routes/category");
const ScheduleRoute = require("./routes/event-schedule");
const TicketRoute = require("./routes/ticket");
const FavouriteRoute = require("./routes/favourite");
const ConversationRoute = require("./routes/conversation");

const server = new App();
server.initializedRoutes([
  // new UserRoute(),
  new AuthRoute(),
  new EventRoute(),
  new CategoryRoute(),
  new ScheduleRoute(),
  new TicketRoute(),
  new FavouriteRoute(),
  new ConversationRoute(),
]);
server.listen();