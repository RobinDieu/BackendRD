const promptForUserDetails = async () => {
  const inquirer = (await import("inquirer")).default;
  const { email, password, roles } = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter user email:",
    },
    {
      type: "password",
      name: "password",
      message: "Enter user password:",
    },
    {
      type: "input",
      name: "roles",
      message: "Enter user roles (comma-separated):",
      filter: (input) =>
        input ? input.split(",").map((role) => role.trim()) : undefined,
    },
  ]);

  return { email, password, roles };
};

const promptForUserUpdateDetails = async () => {
  const inquirer = (await import("inquirer")).default;
  const { email, newEmail, newPassword } = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter user email to update:",
    },
    {
      type: "input",
      name: "newEmail",
      message: "Enter new email (leave blank to keep current):",
    },
    {
      type: "password",
      name: "newPassword",
      message: "Enter new password (leave blank to keep current):",
    },
  ]);

  return { email, newEmail, newPassword };
};

module.exports = {
  promptForUserDetails,
  promptForUserUpdateDetails,
};
