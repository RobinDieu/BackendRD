const path = require("path");
const fs = require("fs");
const { createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const axiosInstance = createAxiosInstance();

const exportRecords = async (modelName, filePath) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${modelName}`);
    const absolutePath = path.resolve(filePath);
    fs.writeFileSync(absolutePath, JSON.stringify(response.data, null, 2));
    console.log(
      `Records of model ${modelName} exported to ${filePath} successfully`
    );
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { exportRecords };
