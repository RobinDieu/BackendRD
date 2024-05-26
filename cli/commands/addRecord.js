const { promptForRecordFields, createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const axiosInstance = createAxiosInstance();

const addRecord = async (modelName) => {
  try {
    // Fetch the schema definition from the server
    const schemaResponse = await axiosInstance.get(
      `${BASE_URL}/dynamic/schema/${modelName}`
    );
    const schemaDefinition = schemaResponse.data.schemaDefinition;

    // Prompt for record fields based on the schema definition
    const record = await promptForRecordFields(schemaDefinition);

    // Add the new record
    const response = await axiosInstance.post(
      `${BASE_URL}/${modelName}`,
      record
    );
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { addRecord };
