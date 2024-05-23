const { execSync } = require("child_process");

const runCommand = (command, options = {}) => {
  try {
    execSync(command, { stdio: "inherit", ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

const promptForSchemaFields = async () => {
  const inquirer = (await import("inquirer")).default;
  const fields = [];
  let addMore = true;

  while (addMore) {
    const { fieldName, fieldType, isRequired, addAnother } =
      await inquirer.prompt([
        {
          type: "input",
          name: "fieldName",
          message: "Enter field name:",
        },
        {
          type: "list",
          name: "fieldType",
          message: "Select field type:",
          choices: ["String", "Number", "Boolean", "Date", "Array", "Object"],
        },
        {
          type: "confirm",
          name: "isRequired",
          message: "Is this field required?",
          default: false,
        },
        {
          type: "confirm",
          name: "addAnother",
          message: "Do you want to add another field?",
          default: true,
        },
      ]);

    fields.push({
      fieldName,
      fieldType,
      isRequired,
    });

    addMore = addAnother;
  }

  return fields;
};

const formatSchemaDefinition = (fields) => {
  const schemaDefinition = {};
  fields.forEach(({ fieldName, fieldType, isRequired }) => {
    schemaDefinition[fieldName] = {
      type: fieldType,
      required: isRequired,
    };
  });
  return schemaDefinition;
};

const promptForRecordFields = async (schemaDefinition) => {
  const inquirer = (await import("inquirer")).default;
  const record = {};

  for (const fieldName in schemaDefinition) {
    const fieldType = schemaDefinition[fieldName].type;
    const isRequired = schemaDefinition[fieldName].required;

    const { fieldValue } = await inquirer.prompt([
      {
        type: "input",
        name: "fieldValue",
        message: `Enter value for ${fieldName} (${fieldType}):`,
        validate: (input) => {
          if (isRequired && !input) {
            return `${fieldName} is required`;
          }
          return true;
        },
      },
    ]);

    record[fieldName] = fieldValue;
  }

  return record;
};

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

const getProjectConfig = (projectTypes) => {
  const projectConfig = {
    react: false,
    electron: false,
    backend: false,
  };

  projectTypes.forEach((type) => {
    projectConfig[type.toLowerCase()] = true;
  });

  return projectConfig;
};

module.exports = {
  runCommand,
  getProjectConfig,
  promptForSchemaFields,
  formatSchemaDefinition,
  promptForRecordFields,
  promptForUserDetails,
  promptForUserUpdateDetails,
};
