const { program } = require("commander");
const { startProject } = require("./commands/startProject");
const { createSchema } = require("./commands/createSchema");
const { addRecord } = require("./commands/addRecord");
const { listRecords } = require("./commands/listRecords");
const { addUser } = require("./commands/addUser");
const { deleteUser } = require("./commands/deleteUser");
const { updateUser } = require("./commands/updateUser");
const { listUsers } = require("./commands/listUsers");
const { createSchemasFromFile } = require("./commands/createSchemasFromFile");
const { addRecordsFromFile } = require("./commands/addRecordsFromFile");
const { exportSchemas } = require("./commands/exportSchemas");
const { exportRecords } = require("./commands/exportRecords");
const { searchRecords } = require("./commands/searchRecords");
const { addRole } = require("./commands/addRole");
const { removeRole } = require("./commands/removeRole");
const { importUsers } = require("./commands/importUsers");
const { listRoutes } = require("./commands/listRoutes");
require("dotenv").config();

program
  .command("start-project <projectName>")
  .description(
    "Start a new project with options for React, Electron, and Backend"
  )
  .option("-p, --path <path>", "Specify the full path of the directory")
  .action((projectName, options) => startProject(projectName, options));

program
  .command("create-schema <modelName>")
  .description("Create a new dynamic schema")
  .action(createSchema);

program
  .command("add-record <modelName>")
  .description("Add a new record to a dynamic schema")
  .action(addRecord);

program
  .command("list-records <modelName>")
  .description("List all records of a dynamic schema")
  .action(listRecords);

program.command("add-user").description("Add a new user").action(addUser);

program
  .command("delete-user <email>")
  .description("Delete a user by email")
  .action(deleteUser);

program
  .command("update-user")
  .description("Update a user's email or password")
  .action(updateUser);

program
  .command("list-users")
  .description("List all users' emails")
  .action(listUsers);

program
  .command("create-schemas-from-file <filePath>")
  .description("Create schemas from a JSON file")
  .action(createSchemasFromFile);

program
  .command("add-records-from-file <modelName> <filePath>")
  .description("Add records from a JSON file to a dynamic schema")
  .action(addRecordsFromFile);

program
  .command("export-schemas <filePath>")
  .description("Export all schemas to a JSON file")
  .action(exportSchemas);

program
  .command("export-records <modelName> <filePath>")
  .description("Export all records of a model to a JSON file")
  .action(exportRecords);

program
  .command("search-records <modelName>")
  .description("Search and filter records of a dynamic schema")
  .action(searchRecords);

program
  .command("add-role <email> <role>")
  .description("Add a role to a user")
  .action(addRole);

program
  .command("remove-role <email> <role>")
  .description("Remove a role from a user")
  .action(removeRole);

program
  .command("import-users <filePath>")
  .description("Import users from a JSON file")
  .action(importUsers);

program
  .command("list-routes")
  .description("List all backend routes")
  .action(listRoutes);

program.parse(process.argv);
