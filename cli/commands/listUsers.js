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

const listUsers = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/auth/users`);
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { listUsers };
