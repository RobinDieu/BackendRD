const path = require("path");
const fs = require("fs");
const { createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const axiosInstance = createAxiosInstance();

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
