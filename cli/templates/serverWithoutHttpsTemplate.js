const http = require("http");
const app = require("./app");
const logger = require("./config/logger");
const { connectDB, disconnectDB } = require("./config/db");
require("dotenv").config();

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app).listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });

  // Handle graceful shutdown
  const shutdown = async () => {
    logger.info("Shutting down server...");
    await disconnectDB();
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
