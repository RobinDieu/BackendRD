const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const logger = require("./logger");

let mongoServer;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (mongoURI) {
    // Connect to external MongoDB server
    try {
      await mongoose.connect(mongoURI);
      logger.info("Connected to external MongoDB");
    } catch (err) {
      logger.error("Error connecting to external MongoDB:", err.message);
      process.exit(1);
    }
  } else {
    // Connect to embedded MongoDB instance
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      logger.info("Connected to embedded MongoDB");
    } catch (err) {
      logger.error("Error connecting to embedded MongoDB:", err.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      logger.info("Embedded MongoDB instance stopped");
    }
    logger.info("Disconnected from MongoDB");
  } catch (err) {
    logger.error("Error during MongoDB disconnection:", err.message);
  }
};

module.exports = { connectDB, disconnectDB };
