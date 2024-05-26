const path = require("path");
const API_KEY = require("../config/apiKey");
const {
  promptForSchemaFields,
  formatSchemaDefinition,
  createAxiosInstance,
} = require("../utils");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

if (!API_KEY) {
  console.error("API_KEY is not defined in the .env file");
  process.exit(1);
}

const BASE_URL = process.env.BASE_URL;
const axiosInstance = createAxiosInstance();

const createSchema = async (modelName) => {
  try {
    const fields = await promptForSchemaFields();
    const schemaDefinition = formatSchemaDefinition(fields);

    const response = await axiosInstance.post(`${BASE_URL}/dynamic/create`, {
      modelName,
      schemaDefinition,
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { createSchema };
