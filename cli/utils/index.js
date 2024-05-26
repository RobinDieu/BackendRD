const { runCommand } = require("./commandUtils");
const {
  promptForSchemaFields,
  formatSchemaDefinition,
  promptForRecordFields,
} = require("./schemaUtils");
const {
  promptForUserDetails,
  promptForUserUpdateDetails,
} = require("./userUtils");
const { getProjectConfig } = require("./projectUtils");
const {
  appJsContent,
  registerJsContent,
  loginJsContent,
  createApiFiles,
  createReactQueryFiles,
  createOrUpdateIndexFile,
  generateApiFilesScript,
} = require("./reactUtils");
const { envBackupContent, envReactContent } = require("./envUtils");
const { serverJsWithoutHttpsContent } = require("./serverUtils");

module.exports = {
  runCommand,
  promptForSchemaFields,
  formatSchemaDefinition,
  promptForRecordFields,
  promptForUserDetails,
  promptForUserUpdateDetails,
  getProjectConfig,
  createApiFiles,
  createReactQueryFiles,
  createOrUpdateIndexFile,
  appJsContent,
  registerJsContent,
  loginJsContent,
  envBackupContent,
  envReactContent,
  serverJsWithoutHttpsContent,
  generateApiFilesScript,
};
