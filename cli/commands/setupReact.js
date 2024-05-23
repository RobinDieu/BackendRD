const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");

const setupReactProject = (projectPath, projectConfig) => {
  console.log("Setting up React project...");

  // Initialize React app
  spawn.sync("npx", ["create-react-app", projectPath], { stdio: "inherit" });

  // Navigate to project directory
  process.chdir(projectPath);

  // Install additional dependencies
  spawn.sync("npm", ["install", "axios"], { stdio: "inherit" });

  // Create .env file
  const envContent = `REACT_APP_API_URL=https://localhost:6969/api\n`;
  fs.writeFileSync(path.join(projectPath, ".env"), envContent);

  // Update package.json scripts
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Install concurrently if not already installed
  spawn.sync("npm", ["install", "concurrently"], { stdio: "inherit" });

  let startScripts = ['"react-scripts start"'];

  if (projectConfig.backend && !projectConfig.electron) {
    startScripts.push('"npm run start:backend"');
    packageJson.scripts["start:backend"] = "cd ../backend && npm start";
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    start: `concurrently ${startScripts.join(" ")}`,
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("React project setup complete.");
};

module.exports = { setupReactProject };
