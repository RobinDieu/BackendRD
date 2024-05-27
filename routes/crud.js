const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const logger = require("../config/logger");
const pluralize = require("pluralize"); // Add pluralize library

// Helper function to normalize model name
const normalizeModelName = (modelName) => {
  return pluralize(modelName.toLowerCase());
};

// Middleware to get the model dynamically
const getModel = (req, res, next) => {
  const modelName = normalizeModelName(req.params.modelName);
  if (!modelName) {
    logger.warn("Model name is required");
    return res.status(400).json({ msg: "Model name is required" });
  }

  try {
    req.Model = mongoose.model(modelName);
    next();
  } catch (err) {
    logger.warn(`Model ${modelName} does not exist`);
    return res
      .status(400)
      .json({ msg: `Model ${modelName} does not exist`, err: err.message });
  }
};

// @route   POST /api/:modelName
// @desc    Create a new document
// @access  Public
router.post("/:modelName", getModel, async (req, res) => {
  try {
    const document = new req.Model(req.body);
    await document.save();
    logger.info(`Document created in model ${req.params.modelName}`);
    res.status(201).json(document);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/:modelName
// @desc    Get all documents with pagination, sorting, and filtering
// @access  Public
router.get("/:modelName", getModel, async (req, res) => {
  const { page = 1, limit = 10, sort = "", ...filters } = req.query;

  try {
    const query = req.Model.find(filters);

    // Apply sorting if the sort parameter is not empty
    if (sort) {
      query.sort(sort);
    }

    const documents = await query
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalDocuments = await req.Model.countDocuments(filters);

    logger.info(`Documents retrieved from model ${req.params.modelName}`);
    res.status(200).json({
      total: totalDocuments,
      page: parseInt(page),
      limit: parseInt(limit),
      data: documents,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/:modelName/:id
// @desc    Get a document by ID
// @access  Public
router.get("/:modelName/:id", getModel, async (req, res) => {
  try {
    const document = await req.Model.findById(req.params.id);
    if (!document) {
      logger.warn(
        `Document not found in model ${req.params.modelName} with ID ${req.params.id}`
      );
      return res.status(404).json({ msg: "Document not found" });
    }
    logger.info(
      `Document retrieved from model ${req.params.modelName} with ID ${req.params.id}`
    );
    res.status(200).json(document);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/:modelName/:id
// @desc    Update a document by ID
// @access  Public
router.put("/:modelName/:id", getModel, async (req, res) => {
  try {
    const document = await req.Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!document) {
      logger.warn(
        `Document not found in model ${req.params.modelName} with ID ${req.params.id}`
      );
      return res.status(404).json({ msg: "Document not found" });
    }
    logger.info(
      `Document updated in model ${req.params.modelName} with ID ${req.params.id}`
    );
    res.status(200).json(document);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/:modelName/:id
// @desc    Delete a document by ID
// @access  Public
router.delete("/:modelName/:id", getModel, async (req, res) => {
  try {
    const document = await req.Model.findByIdAndDelete(req.params.id);
    if (!document) {
      logger.warn(
        `Document not found in model ${req.params.modelName} with ID ${req.params.id}`
      );
      return res.status(404).json({ msg: "Document not found" });
    }
    logger.info(
      `Document deleted from model ${req.params.modelName} with ID ${req.params.id}`
    );
    res.status(200).json({ msg: "Document deleted" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/:modelName/batch
// @desc    Batch create documents
// @access  Public
router.post("/:modelName/batch", getModel, async (req, res) => {
  try {
    const documents = await req.Model.insertMany(req.body);
    logger.info(`Batch documents created in model ${req.params.modelName}`);
    res.status(201).json(documents);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/:modelName/batch
// @desc    Batch delete documents by IDs
// @access  Public
router.delete("/:modelName/batch", getModel, async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    logger.warn("Batch delete failed: IDs are required and should be an array");
    return res
      .status(400)
      .json({ msg: "IDs are required and should be an array" });
  }

  try {
    const result = await req.Model.deleteMany({ _id: { $in: ids } });
    logger.info(`Batch documents deleted from model ${req.params.modelName}`);
    res.status(200).json({ msg: `${result.deletedCount} documents deleted` });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
