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
  createEnvFileReact,
  updatePackageJsonScriptsReact,
  createApiAndQueryFiles,
  installAdditionalDependencies,
  addApiGenerationScriptToBackend,
  createOrUpdateIndexFile,
} = require("./reactUtils");
const {
  cloneBackendRepo,
  installDependencies,
  createEnvFileBackend,
  generateSelfSignedCerts,
  setupServerFile,
  setupSessionMiddleware,
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
  createEnvFileReact,
  updatePackageJsonScriptsReact,
  installAdditionalDependencies,
  addApiGenerationScriptToBackend,
  cloneBackendRepo,
  installDependencies,
  createEnvFileBackend,
  createOrUpdateIndexFile,
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
  setupSessionMiddleware,
};
