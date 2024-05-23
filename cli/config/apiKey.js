const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not defined in the .env file");
  process.exit(1);
}

module.exports = API_KEY;
