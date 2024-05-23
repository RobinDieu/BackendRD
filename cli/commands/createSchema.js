const axios = require("axios");
const https = require("https");
const API_KEY = require("../config/apiKey");
const {
  promptForSchemaFields,
  formatSchemaDefinition,
} = require("../utils/helpers");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

// Create an axios instance with custom httpsAgent
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    "x-api-key": API_KEY,
  },
});

const createSchema = async (modelName) => {
  try {
    const fields = await promptForSchemaFields();
    const schemaDefinition = formatSchemaDefinition(fields);

    const response = await axiosInstance.post(`${BASE_URL}/dynamic/create`, {
      modelName,
      schemaDefinition,
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { createSchema };
