const { program } = require("commander");
const axios = require("axios");
const https = require("https");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const BASE_URL = "https://localhost:6969/api";

// Create an axios instance with custom httpsAgent
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Function to prompt for schema fields
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

// Function to format schema definition
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

// Function to prompt for record fields
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

// Command to create a new dynamic schema
program
  .command("create-schema <modelName>")
  .description("Create a new dynamic schema")
  .action(async (modelName) => {
    try {
      const fields = await promptForSchemaFields();
      const schemaDefinition = formatSchemaDefinition(fields);

      const response = await axiosInstance.post(`${BASE_URL}/dynamic/create`, {
        modelName,
        schemaDefinition,
      });
      console.log(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to add a new record to a dynamic schema
program
  .command("add-record <modelName>")
  .description("Add a new record to a dynamic schema")
  .action(async (modelName) => {
    try {
      // Fetch the schema definition from the server
      const schemaResponse = await axiosInstance.get(
        `${BASE_URL}/dynamic/schema/${modelName}`
      );
      const schemaDefinition = schemaResponse.data.schemaDefinition;

      // Prompt for record fields based on the schema definition
      const record = await promptForRecordFields(schemaDefinition);

      // Add the new record
      const response = await axiosInstance.post(
        `${BASE_URL}/${modelName}`,
        record
      );
      console.log(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to list all records of a dynamic schema
program
  .command("list-records <modelName>")
  .description("List all records of a dynamic schema")
  .action(async (modelName) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${modelName}`);
      console.log(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Function to prompt for user details
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

// Command to add a new user
program
  .command("add-user")
  .description("Add a new user")
  .action(async () => {
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
  });

// Command to delete a user
program
  .command("delete-user <email>")
  .description("Delete a user by email")
  .action(async (email) => {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/auth/user`, {
        data: { email },
      });
      console.log(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Function to prompt for user update details
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

// Command to update a user's email or password
program
  .command("update-user")
  .description("Update a user's email or password")
  .action(async () => {
    try {
      const { email, newEmail, newPassword } =
        await promptForUserUpdateDetails();

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
  });

// Command to list all users' emails
program
  .command("list-users")
  .description("List all users' emails")
  .action(async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/auth/users`);
      console.log(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

program
  .command("create-schemas-from-file <filePath>")
  .description("Create schemas from a JSON file")
  .action(async (filePath) => {
    try {
      const absolutePath = path.resolve(filePath);
      const fileContent = fs.readFileSync(absolutePath, "utf-8");
      const schemas = JSON.parse(fileContent);

      for (const schema of schemas) {
        const { modelName, schemaDefinition } = schema;
        const response = await axiosInstance.post(
          `${BASE_URL}/dynamic/create`,
          {
            modelName,
            schemaDefinition,
          }
        );
        console.log(
          `Schema for model ${modelName} created successfully:`,
          response.data
        );
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to add records from a JSON file
program
  .command("add-records-from-file <modelName> <filePath>")
  .description("Add records from a JSON file to a dynamic schema")
  .action(async (modelName, filePath) => {
    try {
      const absolutePath = path.resolve(filePath);
      const fileContent = fs.readFileSync(absolutePath, "utf-8");
      const records = JSON.parse(fileContent);

      for (const record of records) {
        const response = await axiosInstance.post(
          `${BASE_URL}/${modelName}`,
          record
        );
        console.log(
          `Record added to model ${modelName} successfully:`,
          response.data
        );
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to export schemas to a JSON file
program
  .command("export-schemas <filePath>")
  .description("Export all schemas to a JSON file")
  .action(async (filePath) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/dynamic/schemas`);
      const absolutePath = path.resolve(filePath);
      fs.writeFileSync(absolutePath, JSON.stringify(response.data, null, 2));
      console.log(`Schemas exported to ${filePath} successfully`);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to export records to a JSON file
program
  .command("export-records <modelName> <filePath>")
  .description("Export all records of a model to a JSON file")
  .action(async (modelName, filePath) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${modelName}`);
      const absolutePath = path.resolve(filePath);
      fs.writeFileSync(absolutePath, JSON.stringify(response.data, null, 2));
      console.log(
        `Records of model ${modelName} exported to ${filePath} successfully`
      );
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to search and filter records of a dynamic schema
program
  .command("search-records <modelName>")
  .description("Search and filter records of a dynamic schema")
  .action(async (modelName) => {
    const inquirer = (await import("inquirer")).default;
    try {
      const { field, value } = await inquirer.prompt([
        {
          type: "input",
          name: "field",
          message: "Enter the field to search by:",
        },
        {
          type: "input",
          name: "value",
          message: "Enter the value to search for:",
        },
      ]);

      const response = await axiosInstance.get(`${BASE_URL}/${modelName}`, {
        params: { [field]: value },
      });
      console.log(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to add a role to a user
program
  .command("add-role <email> <role>")
  .description("Add a role to a user")
  .action(async (email, role) => {
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
  });

// Command to remove a role from a user
program
  .command("remove-role <email> <role>")
  .description("Remove a role from a user")
  .action(async (email, role) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/auth/user/role`, {
        email,
        role,
        action: "remove",
      });
      console.log(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  });

// Command to import users from a JSON file
program
  .command("import-users <filePath>")
  .description("Import users from a JSON file")
  .action(async (filePath) => {
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
  });

program.parse(process.argv);
