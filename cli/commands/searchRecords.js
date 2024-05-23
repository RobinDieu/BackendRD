const axios = require("axios");
const https = require("https");
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

const searchRecords = async (modelName) => {
  const inquirer = (await import("inquirer")).default;
  try {
    const { field, value } = await inquirer.prompt([
      {
        type: "input",
        name: "field",
        message: "Enter the field to search by:",
      },
      {
        type: "input",
        name: "value",
        message: "Enter the value to search for:",
      },
    ]);

    const response = await axiosInstance.get(`${BASE_URL}/${modelName}`, {
      params: { [field]: value },
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { searchRecords };
