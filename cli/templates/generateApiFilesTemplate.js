// backend/scripts/generateApiFilesTemplate.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Schema = require("../models/Schema");
require("dotenv").config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI);

const toCamelCase = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

const generateApiFileContent = (modelName) => {
  const pluralModelName = modelName.toLowerCase();
  const camelModelName = toCamelCase(modelName);
  return `// Example API file for ${modelName}
import axiosInstance from "./axiosInstance";

export const get${camelModelName}s = async () => {
  const response = await axiosInstance.get("/${pluralModelName}s");
  return response.data;
};

export const get${camelModelName}ById = async (id) => {
  const response = await axiosInstance.get(\`/${pluralModelName}s/\${id}\`);
  return response.data;
};

export const create${camelModelName} = async (${pluralModelName}Data) => {
  const response = await axiosInstance.post("/${pluralModelName}s", ${pluralModelName}Data);
  return response.data;
};

export const update${camelModelName} = async (id, ${pluralModelName}Data) => {
  const response = await axiosInstance.put(\`/${pluralModelName}s/\${id}\`, ${pluralModelName}Data);
  return response.data;
};

export const delete${camelModelName} = async (id) => {
  const response = await axiosInstance.delete(\`/${pluralModelName}s/\${id}\`);
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
