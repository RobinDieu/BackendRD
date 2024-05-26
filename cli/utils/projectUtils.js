const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");

const getProjectConfig = (projectTypes) => {
  const projectConfig = {
    react: false,
    electron: false,
    backend: false,
    mantine: false,
  };

  projectTypes.forEach((type) => {
    switch (type.toLowerCase()) {
      case "react":
        projectConfig.react = true;
        break;
      case "electron":
        projectConfig.electron = true;
        break;
      case "backend":
        projectConfig.backend = true;
        break;
      case "mantine":
        projectConfig.mantine = true;
        break;
      default:
        break;
    }
  });

  return projectConfig;
};

const getProjectPath = (projectName, options) => {
  let projectPath;
  if (options.path) {
    projectPath = path.resolve(options.path, projectName);
  } else {
    projectPath = path.resolve(process.env.DEFAULT_PROJECT_PATH, projectName);
  }
  return projectPath;
};

const createProjectDirectory = (projectPath, projectName) => {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  } else {
    console.error(`Directory ${projectName} already exists.`);
    process.exit(1);
  }
};

const getProjectTypes = async () => {
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

  const projectTypes = [];
  if (frontendType !== "None") projectTypes.push(frontendType);
  if (desktopType !== "None") projectTypes.push(desktopType);
  if (backendType !== "None") projectTypes.push(backendType);
  if (uiType !== "None") projectTypes.push(uiType);

  return projectTypes;
};

module.exports = {
  getProjectPath,
  createProjectDirectory,
  getProjectTypes,
  getProjectConfig,
};
