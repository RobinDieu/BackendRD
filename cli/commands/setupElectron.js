const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");

const setupElectronProject = (projectPath, projectConfig) => {
  console.log("Setting up Electron project...");

  // Ensure the directory exists
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  // Initialize npm project
  spawn.sync("npm", ["init", "-y"], { cwd: projectPath, stdio: "inherit" });

  // Install Electron and other dependencies
  spawn.sync("npm", ["install", "electron", "concurrently", "wait-on"], {
    cwd: projectPath,
    stdio: "inherit",
  });

  // Ensure the directory for main.js exists
  const mainJsDir = path.join(projectPath);
  if (!fs.existsSync(mainJsDir)) {
    fs.mkdirSync(mainJsDir, { recursive: true });
  }

  // Create main.js file
  const mainJsContent = `
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
  `;
  fs.writeFileSync(path.join(mainJsDir, "main.js"), mainJsContent);
  // Update package.json scripts
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

  console.log("Electron project setup complete.");
};

module.exports = { setupElectronProject };
