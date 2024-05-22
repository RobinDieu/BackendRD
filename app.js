const express = require("express");
const connectDB = require("./config/db");
const rateLimit = require("./middleware/rateLimit");
const logger = require("./config/logger");
const createDynamicModel = require("./models/DynamicModel");
const Schema = require("./models/Schema");
require("dotenv").config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(rateLimit);

// Load dynamic schemas on startup
const loadSchemas = async () => {
  try {
    const schemas = await Schema.find();
    schemas.forEach((schema) => {
      createDynamicModel(schema.modelName, schema.schemaDefinition);
      logger.info(`Loaded dynamic model ${schema.modelName}`);
    });
  } catch (err) {
    logger.error(`Error loading schemas: ${err.message}`);
  }
};

loadSchemas();

// Define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/password-reset", require("./routes/passwordReset"));
app.use("/api/email-verification", require("./routes/emailVerification"));
app.use("/api/dynamic", require("./routes/dynamic"));
app.use("/api", require("./routes/crud"));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send("Server error");
});

module.exports = app;
