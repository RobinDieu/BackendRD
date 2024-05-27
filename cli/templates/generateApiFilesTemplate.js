// backend/scripts/generateApiFilesTemplate.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Schema = require("../models/Schema");
const pluralize = require("pluralize");
require("dotenv").config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI);

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateApiFileContent = (modelName) => {
  const modelNameLowerCase = modelName.toLowerCase();
  const camelModelName = capitalizeFirstLetter(modelNameLowerCase);
  const singularModelName = pluralize.singular(modelNameLowerCase);
  const camelSingularModelName = capitalizeFirstLetter(singularModelName);

  return `// Example API file for ${modelName}
import axiosInstance from "./axiosInstance";

export const get${camelModelName} = async () => {
  const response = await axiosInstance.get("/${modelNameLowerCase}");
  return response.data;
};

export const get${camelSingularModelName}ById = async (id) => {
  const response = await axiosInstance.get(\`/${modelNameLowerCase}/\${id}\`);
  return response.data;
};

export const create${camelSingularModelName} = async (${camelSingularModelName}Data) => {
  const response = await axiosInstance.post("/${modelNameLowerCase}", ${camelSingularModelName}Data);
  return response.data;
};

export const update${camelSingularModelName} = async (id, ${camelSingularModelName}Data) => {
  const response = await axiosInstance.put(\`/${modelNameLowerCase}/\${id}\`, ${camelSingularModelName}Data);
  return response.data;
};

export const delete${camelSingularModelName} = async (id) => {
  const response = await axiosInstance.delete(\`/${modelNameLowerCase}/\${id}\`);
  return response.data;
};
`;
};

const writeApiFile = (apiPath, modelName) => {
  const content = generateApiFileContent(modelName);
  const filePath = path.join(apiPath, `${modelName.toLowerCase()}API.js`);
  fs.writeFileSync(filePath, content);
  console.log(`API file for ${modelName} created successfully.`);
};

const generateApiFiles = async () => {
  try {
    const schemas = await Schema.find();
    const frontendPath = path.join(__dirname, "../../frontend");
    const apiPath = path.join(frontendPath, "src/api");

    // Check if the frontend directory exists
    if (!fs.existsSync(frontendPath)) {
      console.log("No React app setup found. Skipping API file generation.");
      return;
    }

    if (!fs.existsSync(apiPath)) {
      fs.mkdirSync(apiPath, { recursive: true });
    }

    schemas.forEach((schema) => {
      writeApiFile(apiPath, schema.modelName);
    });

    console.log("All API files generated successfully.");
  } catch (err) {
    console.error("Error generating API files:", err);
  } finally {
    mongoose.connection.close();
  }
};

generateApiFiles();
