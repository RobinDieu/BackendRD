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

const addRole = async (email, role) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/auth/user/role`, {
      email,
      role,
      action: "add",
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { addRole };
