const mongoose = require("mongoose");

const schemaSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
    unique: true,
  },
  schemaDefinition: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Schema = mongoose.model("Schema", schemaSchema);

module.exports = Schema;
