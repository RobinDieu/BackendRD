const axios = require("axios");
const https = require("https");
const API_KEY = require("../config/apiKey");
const { promptForUserDetails } = require("../utils/index");
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

const addUser = async () => {
  try {
    const userDetails = await promptForUserDetails();

    const response = await axiosInstance.post(
      `${BASE_URL}/auth/register`,
      userDetails
    );
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { addUser };
