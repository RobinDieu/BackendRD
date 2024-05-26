const { promptForUserUpdateDetails, createAxiosInstance } = require("../utils");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const axiosInstance = createAxiosInstance();

const updateUser = async () => {
  try {
    const { email, newEmail, newPassword } = await promptForUserUpdateDetails();

    const updateData = {};
    if (newEmail) updateData.email = newEmail;
    if (newPassword) updateData.password = newPassword;

    const response = await axiosInstance.put(`${BASE_URL}/auth/user`, {
      email,
      updateData,
    });
    console.log(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};

module.exports = { updateUser };
