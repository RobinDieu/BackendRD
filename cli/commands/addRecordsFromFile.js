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

const addRecordsFromFile = async (modelName, filePath) => {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const records = JSON.parse(fileContent);

    for (const record of records) {
      const response = await axiosInstance.post(
        `${BASE_URL}/${modelName}`,
        record
      );
      console.log(
        `Record added to model ${modelName} successfully:`,
        response.data
      );
    }
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { addRecordsFromFile };
