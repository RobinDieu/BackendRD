const express = require("express");
const cors = require("cors");
const rateLimit = require("./middleware/rateLimit");
const apiKeyAuth = require("./middleware/apiKeyAuth");
const passportAuth = require("./middleware/passportAuth");
const logger = require("./config/logger");
const createDynamicModel = require("./models/DynamicModel");
const Schema = require("./models/Schema");
const sessionMiddleware = require("./middleware/session");
const helmetMiddleware = require("./middleware/helmet");
require("dotenv").config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(helmetMiddleware);
app.use(express.json());
app.use(rateLimit);
app.use(apiKeyAuth);
app.use(sessionMiddleware);

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

  // Error handling middlewares
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send("Server error");
  });
};

initializeApp();

module.exports = app;
