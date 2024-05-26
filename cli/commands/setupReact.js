const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");
const {
  createApiAndQueryFiles,
  createEnvFile,
  createOrUpdateComponentFiles,
  installAdditionalDependencies,
  addApiGenerationScriptToBackend,
} = require("../utils/index");

const setupReactProject = (projectPath, projectConfig) => {
  console.log("Setting up React project...");

  initializeReactApp(projectPath);
  createEnvFile(projectPath);
  updatePackageJsonScripts(projectPath, projectConfig);

  if (projectConfig.backend) {
    setupReactWithBackend(projectPath, projectConfig);
  }

  console.log("React project setup complete.");
};

const initializeReactApp = (projectPath) => {
  spawn.sync("npx", ["create-react-app", projectPath], { stdio: "inherit" });
  process.chdir(projectPath);
};

const setupReactWithBackend = (projectPath, projectConfig) => {
  installAdditionalDependencies();
  createApiAndQueryFiles(projectPath, projectConfig);
  createOrUpdateComponentFiles(projectPath);
  addApiGenerationScriptToBackend(projectPath);
};

module.exports = { setupReactProject };
