const axios = require("axios");
const https = require("https");
const { API_KEY } = process.env;

const createAxiosInstance = () => {
  return axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      "x-api-key": API_KEY || "YOU_SHOULD_CHANGE_THIS_TOO",
    },
  });
};

module.exports = { createAxiosInstance };
