const spawn = require("cross-spawn");
const {
  createApiAndQueryFiles,
  createEnvFileReact,
  createOrUpdateComponentFiles,
  installAdditionalDependencies,
  addApiGenerationScriptToBackend,
  updatePackageJsonScriptsReact,
  createPostcssConfigFile,
} = require("../utils");

const setupReactProject = (projectPath, projectConfig) => {
  console.log("Setting up React project...");

  initializeReactApp(projectPath);
  createEnvFileReact(projectPath);
  updatePackageJsonScriptsReact(projectPath, projectConfig);

  if (projectConfig.backend) {
    setupReactWithBackend(projectPath, projectConfig);
  }

  if (projectConfig.mantine) {
    createPostcssConfigFile(projectPath);
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
