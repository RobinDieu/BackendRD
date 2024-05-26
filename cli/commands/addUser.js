const { promptForUserDetails, createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const axiosInstance = createAxiosInstance();

const addUser = async () => {
  try {
    const userDetails = await promptForUserDetails();

    const response = await axiosInstance.post(
      `${BASE_URL}/auth/register`,
      userDetails
    );
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { addUser };
