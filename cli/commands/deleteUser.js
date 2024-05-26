const { createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const axiosInstance = createAxiosInstance();

const deleteUser = async (email) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/auth/user`, {
      data: { email },
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { deleteUser };
