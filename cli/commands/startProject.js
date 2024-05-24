const path = require("path");
const fs = require("fs");
const { setupReactProject } = require("./setupReact");
const { setupElectronProject } = require("./setupElectron");
const { setupBackendProject } = require("./setupBackend");
const { getProjectConfig } = require("../utils/helpers");
require("dotenv").config();

const startProject = async (projectName, options) => {
  const inquirer = (await import("inquirer")).default;

  const { projectTypes } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "projectTypes",
      message: "Select the project types:",
      choices: ["React", "Electron", "Backend"],
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

  const projectConfig = getProjectConfig(projectTypes);

  if (projectConfig.backend) {
    setupBackendProject(path.join(projectPath, "backend"), projectConfig);
  }

  if (projectConfig.react) {
    setupReactProject(path.join(projectPath, "frontend"), projectConfig);
  }

  if (projectConfig.electron) {
    setupElectronProject(path.join(projectPath, "electron"), projectConfig);
  }

  console.log("Project setup complete.");
};

module.exports = { startProject };
