const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const LOCAL_POSTGRESQL = "postgresql://postgres:@localhost:5432/event_management";

const ENV = {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl:
    process.env.NODE_ENV === "development"
      ? LOCAL_POSTGRESQL
      : process.env.DATABASE_URL,
  backendURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : `https://`,
};

module.exports = ENV;
