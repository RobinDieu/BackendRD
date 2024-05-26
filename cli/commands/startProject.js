const path = require("path");
const fs = require("fs");
const { setupReactProject } = require("./setupReact");
const { setupElectronProject } = require("./setupElectron");
const { setupBackendProject } = require("./setupBackend");
const { setupMantine } = require("./setupMantine");
const { getProjectConfig } = require("../utils/index");
const { createOrUpdateIndexFile } = require("../utils/reactUtils");
require("dotenv").config();

const startProject = async (projectName, options) => {
  const inquirer = (await import("inquirer")).default;

  const { frontendType } = await inquirer.prompt([
    {
      type: "list",
      name: "frontendType",
      message: "Select the frontend type:",
      choices: ["React", "None"],
    },
  ]);

  const { desktopType } = await inquirer.prompt([
    {
      type: "list",
      name: "desktopType",
      message: "Select the desktop type:",
      choices: ["Electron", "None"],
    },
  ]);

  const { backendType } = await inquirer.prompt([
    {
      type: "list",
      name: "backendType",
      message: "Select the backend type:",
      choices: ["Backend", "None"],
    },
  ]);

  const { uiType } = await inquirer.prompt([
    {
      type: "list",
      name: "uiType",
      message: "Select the UI type:",
      choices: ["Mantine", "None"],
    },
  ]);

  let projectPath;
  if (options.path) {
    projectPath = path.resolve(options.path, projectName);
  } else {
    projectPath = path.resolve(process.env.DEFAULT_PROJECT_PATH, projectName);
  }

  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  } else {
    console.error(`Directory ${projectName} already exists.`);
    process.exit(1);
  }

  const projectTypes = [];
  if (frontendType !== "None") projectTypes.push(frontendType);
  if (desktopType !== "None") projectTypes.push(desktopType);
  if (backendType !== "None") projectTypes.push(backendType);
  if (uiType !== "None") projectTypes.push(uiType);

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
