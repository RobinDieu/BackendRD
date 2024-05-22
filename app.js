const express = require("express");
const connectDB = require("./config/db");
const rateLimit = require("./middleware/rateLimit");
const apiKeyAuth = require("./middleware/apiKeyAuth");
const passportAuth = require("./middleware/passportAuth");
const session = require("express-session");
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
app.use(apiKeyAuth);

// Configure and use express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Set to true if using HTTPS
  })
);

passportAuth(app); // Initialize Passport and session middleware

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

// Initialize the app
const initializeApp = async () => {
  await loadSchemas();

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
};

initializeApp();

module.exports = app;
