const axios = require("axios");
const https = require("https");
const API_KEY = require("../config/apiKey");
const { promptForUserUpdateDetails } = require("../utils/helpers");
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

const updateUser = async () => {
  try {
    const { email, newEmail, newPassword } = await promptForUserUpdateDetails();

    const updateData = {};
    if (newEmail) updateData.email = newEmail;
    if (newPassword) updateData.password = newPassword;

    const response = await axiosInstance.put(`${BASE_URL}/auth/user`, {
      email,
      updateData,
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { updateUser };
