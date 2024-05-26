const path = require("path");
const fs = require("fs");
const { createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const axiosInstance = createAxiosInstance();

const createSchemasFromFile = async (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const schemas = JSON.parse(fileContent);

    for (const schema of schemas) {
      const { modelName, schemaDefinition } = schema;
      const response = await axiosInstance.post(`${BASE_URL}/dynamic/create`, {
        modelName,
        schemaDefinition,
      });
      console.log(
        `Schema for model ${modelName} created successfully:`,
        response.data
      );
    }
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { createSchemasFromFile };
