const {
  createProjectDirectoryElectron,
  initializeNpmProject,
  installElectronDependencies,
  setupMainJsFile,
  updatePackageJsonScriptsElectron,
} = require("../utils/index");

const setupElectronProject = (projectPath, projectConfig) => {
  console.log("Setting up Electron project...");

  createProjectDirectoryElectron(projectPath);
  initializeNpmProject(projectPath);
  installElectronDependencies(projectPath);
  setupMainJsFile(projectPath);
  updatePackageJsonScriptsElectron(projectPath, projectConfig);

  console.log("Electron project setup complete.");
};

module.exports = { setupElectronProject };
