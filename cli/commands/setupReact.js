const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");
const {
  createApiFiles,
  createReactQueryFiles,
  createOrUpdateIndexFile,
  envReactContent,
  loginJsContent,
  registerJsContent,
  appJsContent,
} = require("../utils/helpers");

const setupReactProject = (projectPath, projectConfig) => {
  console.log("Setting up React project...");

  // Initialize React app
  spawn.sync("npx", ["create-react-app", projectPath], { stdio: "inherit" });

  // Navigate to project directory
  process.chdir(projectPath);

  if (projectConfig.backend) {
    // Install additional dependencies
    spawn.sync(
      "npm",
      ["install", "axios", "@tanstack/react-query", "react-router-dom"],
      {
        stdio: "inherit",
      }
    );
  }

  // Create .env file
  fs.writeFileSync(path.join(projectPath, ".env"), envReactContent);

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

  if (projectConfig.backend) {
    // Create API directory and files
    createApiFiles(path.join(projectPath, "src/api"));

    // Create queryClient.js and useAuth.js
    createReactQueryFiles(path.join(projectPath, "src"));

    // Create or overwrite index.js file
    createOrUpdateIndexFile(path.join(projectPath, "src"));

    // Ensure components directory exists
    const componentsDir = path.join(projectPath, "src/components");
    fs.mkdirSync(componentsDir, { recursive: true });

    // Create or update Login.js, Register.js, and App.js
    fs.writeFileSync(path.join(componentsDir, "Login.js"), loginJsContent);
    fs.writeFileSync(
      path.join(componentsDir, "Register.js"),
      registerJsContent
    );
    fs.writeFileSync(path.join(projectPath, "src/App.js"), appJsContent);
  }

  console.log("React project setup complete.");
};

module.exports = { setupReactProject };
