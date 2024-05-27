const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");
const { readAndWriteTemplate } = require("./templateUtils");

const createProjectDirectoryElectron = (projectPath) => {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }
};

const initializeNpmProject = (projectPath) => {
  spawn.sync("npm", ["init", "-y"], { cwd: projectPath, stdio: "inherit" });
};

const installElectronDependencies = (projectPath) => {
  spawn.sync("npm", ["install", "electron", "concurrently", "wait-on"], {
    cwd: projectPath,
    stdio: "inherit",
  });
};

const setupMainJsFile = (projectPath) => {
  readAndWriteTemplate(
    "MainElectronTemplate.js",
    path.join(projectPath, "main.js")
  );
};

const updatePackageJsonScriptsElectron = (projectPath, projectConfig) => {
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  let startScripts = [];
  let individualScripts = {};

  if (projectConfig.react) {
    startScripts.push("npm run start:react");
    individualScripts["start:react"] = "cd ../frontend && npm start";
  }

  if (projectConfig.electron) {
    startScripts.push("npm run start:electron");
    individualScripts["start:electron"] =
      "wait-on http://localhost:3000 && electron .";
  }

  if (projectConfig.backend) {
    startScripts.push("npm run start:backend");
    individualScripts["start:backend"] = "cd ../backend && npm start";
  }

  packageJson.scripts = {
    start: `concurrently "${startScripts.join('" "')}"`,
    ...individualScripts,
  };
  packageJson.main = "main.js";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

module.exports = {
  createProjectDirectoryElectron,
  initializeNpmProject,
  installElectronDependencies,
  setupMainJsFile,
  updatePackageJsonScriptsElectron,
};
