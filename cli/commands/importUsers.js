const path = require("path");
const fs = require("fs");
const { createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const axiosInstance = createAxiosInstance();

const importUsers = async (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const users = JSON.parse(fileContent);

    for (const user of users) {
      const response = await axiosInstance.post(
        `${BASE_URL}/auth/register`,
        user
      );
      console.log(`User ${user.email} created successfully:`, response.data);
    }
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { importUsers };
