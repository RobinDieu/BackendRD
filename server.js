const fs = require("fs");
const https = require("https");
const path = require("path");
const app = require("./app");
const logger = require("./config/logger");
const { connectDB, disconnectDB } = require("./config/db");
require("dotenv").config();

// HTTPS setup
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = https.createServer(sslOptions, app).listen(PORT, () => {
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
