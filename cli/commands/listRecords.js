const { createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

// Create an axios instance with custom httpsAgent
const axiosInstance = createAxiosInstance();

const listRecords = async (modelName) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${modelName}`);
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { listRecords };
