const { setupReactProject } = require("./setupReact");
const { setupElectronProject } = require("./setupElectron");
const { setupBackendProject } = require("./setupBackend");
const { setupMantine } = require("./setupMantine");
const {
  getProjectConfig,
  getProjectPath,
  createProjectDirectory,
  getProjectTypes,
  createOrUpdateIndexFile,
} = require("../utils/index");
require("dotenv").config();

const startProject = async (projectName, options) => {
  const projectPath = getProjectPath(projectName, options);
  createProjectDirectory(projectPath, projectName);

  const projectTypes = await getProjectTypes();
  const projectConfig = getProjectConfig(projectTypes);

  if (projectConfig.backend) {
    setupBackendProject(path.join(projectPath, "backend"), projectConfig);
  }

  if (projectConfig.react) {
    setupReactProject(path.join(projectPath, "frontend"), projectConfig);
    if (projectConfig.mantine) {
      setupMantine(path.join(projectPath, "frontend"));
    }
    createOrUpdateIndexFile(
      path.join(projectPath, "frontend", "src"),
      projectConfig
    );
  }

  if (projectConfig.electron) {
    setupElectronProject(path.join(projectPath, "electron"), projectConfig);
  }

  console.log("Project setup complete.");
};

module.exports = { startProject };
