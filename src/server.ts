/* eslint-disable no-console */
import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";
import { envVers } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;
const startServer = async () => {
  try {
    await mongoose.connect(envVers.DB_URL);
    console.log(`database is connected!`);
    server = app.listen(envVers.PORT, () => {
      console.log(`Server is running Now ${envVers.PORT}!`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log("unhandleRejection your server is shutting down!", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("uncaughtException your server is shutting down!", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtExceptionMonitor", (err) => {
  console.log("uncaughtExceptionMonitor your server is shutting down!", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM your server is shutting down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT your server is shutting down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
