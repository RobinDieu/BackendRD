const {
  cloneBackendRepo,
  installDependencies,
  createEnvFile,
  generateSelfSignedCerts,
  setupServerFile,
} = require("../utils/index");

const setupBackendProject = (projectPath, projectConfig) => {
  console.log("Setting up Backend project...");

  const projectPathArray = projectPath.split(path.sep);
  const projectName = projectPathArray[projectPathArray.length - 2];

  cloneBackendRepo(projectPath);
  installDependencies(projectPath);

  const protocol = projectConfig.react ? "http" : "https";
  createEnvFile(projectPath, projectName, protocol);
  generateSelfSignedCerts(projectPath);

  if (projectConfig.react) {
    setupServerFile(projectPath, false);
  }

  console.log("Backend project setup complete.");
};

module.exports = { setupBackendProject };
