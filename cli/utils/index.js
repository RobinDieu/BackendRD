const {
  promptForSchemaFields,
  formatSchemaDefinition,
  promptForRecordFields,
} = require("./schemaUtils");
const {
  promptForUserDetails,
  promptForUserUpdateDetails,
} = require("./userUtils");
const {
  getProjectPath,
  createProjectDirectory,
  getProjectTypes,
  getProjectConfig,
} = require("./projectUtils");
const {
  createOrUpdateComponentFiles,
  createEnvFile,
  updatePackageJsonScripts,
  createApiAndQueryFiles,
  installAdditionalDependencies,
  addApiGenerationScriptToBackend,
} = require("./reactUtils");
const {
  cloneBackendRepo,
  installDependencies,
  createEnvFileBackend,
  generateSelfSignedCerts,
  setupServerFile,
} = require("../utils/backendUtils");
const { envBackupContent, envReactContent } = require("./envUtils");
const { readAndWriteTemplate } = require("./templateUtils");
const {
  createProjectDirectoryElectron,
  initializeNpmProject,
  installElectronDependencies,
  setupMainJsFile,
  updatePackageJsonScriptsElectron,
} = require("./electronUtils");
const { createAxiosInstance } = require("./axiosUtils");

module.exports = {
  promptForSchemaFields,
  formatSchemaDefinition,
  promptForRecordFields,
  promptForUserDetails,
  promptForUserUpdateDetails,
  getProjectConfig,
  createOrUpdateComponentFiles,
  readAndWriteTemplate,
  envBackupContent,
  envReactContent,
  createApiAndQueryFiles,
  createEnvFile,
  updatePackageJsonScripts,
  installAdditionalDependencies,
  addApiGenerationScriptToBackend,
  cloneBackendRepo,
  installDependencies,
  createEnvFileBackend,
  generateSelfSignedCerts,
  setupServerFile,
  getProjectPath,
  createProjectDirectory,
  getProjectTypes,
  createProjectDirectoryElectron,
  initializeNpmProject,
  installElectronDependencies,
  setupMainJsFile,
  updatePackageJsonScriptsElectron,
  createAxiosInstance,
};
