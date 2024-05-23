const axios = require("axios");
const https = require("https");
const path = require("path");
const fs = require("fs");
const API_KEY = require("../config/apiKey");
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

const exportSchemas = async (filePath) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/dynamic/schemas`);
    const absolutePath = path.resolve(filePath);
    fs.writeFileSync(absolutePath, JSON.stringify(response.data, null, 2));
    console.log(`Schemas exported to ${filePath} successfully`);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { exportSchemas };
