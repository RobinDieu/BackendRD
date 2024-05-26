const { createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const axiosInstance = createAxiosInstance();

const addRole = async (email, role) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/auth/user/role`, {
      email,
      role,
      action: "add",
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { addRole };
