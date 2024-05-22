const express = require("express");
const router = express.Router();
const createDynamicModel = require("../models/DynamicModel");
const Schema = require("../models/Schema");
const logger = require("../config/logger");

// @route   POST /api/dynamic/create
// @desc    Create a new dynamic schema
// @access  Public
router.post("/create", async (req, res) => {
  const { modelName, schemaDefinition } = req.body;

  if (!modelName || !schemaDefinition) {
    logger.warn(
      "Dynamic schema creation failed: Model name and schema definition are required"
    );
    return res
      .status(400)
      .json({ msg: "Model name and schema definition are required" });
  }

  try {
    const DynamicModel = createDynamicModel(modelName, schemaDefinition);
    await DynamicModel.init(); // Ensure indexes are created

    // Save the schema definition in the database
    const schema = new Schema({ modelName, schemaDefinition });
    await schema.save();

    logger.info(`Dynamic model ${modelName} created successfully`);
    res.status(201).json({ msg: `Model ${modelName} created successfully` });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/dynamic/schema/:modelName
// @desc    Get the schema definition for a model
// @access  Public
router.get("/schema/:modelName", async (req, res) => {
  const { modelName } = req.params;

  try {
    const schema = await Schema.findOne({ modelName });
    if (!schema) {
      logger.warn(`Schema not found for model ${modelName}`);
      return res
        .status(404)
        .json({ msg: `Schema not found for model ${modelName}` });
    }

    res.status(200).json(schema);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/dynamic/schemas
// @desc    Get all schemas
// @access  Public
router.get("/schemas", async (req, res) => {
  try {
    const schemas = await Schema.find();
    res.json(schemas);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
