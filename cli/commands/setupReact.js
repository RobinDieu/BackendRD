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
} = require("../utils/index");

const setupReactProject = (projectPath, projectConfig) => {
  console.log("Setting up React project...");

  // Initialize React app
  spawn.sync("npx", ["create-react-app", projectPath], { stdio: "inherit" });

  // Navigate to project directory
  process.chdir(projectPath);

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
    setupReactWithBackend(projectPath, projectConfig);
  }

  console.log("React project setup complete.");
};

const setupReactWithBackend = (projectPath, projectConfig) => {
  // Install additional dependencies
  spawn.sync(
    "npm",
    ["install", "axios", "@tanstack/react-query", "react-router-dom"],
    {
      stdio: "inherit",
    }
  );

  // Create API directory and files
  createApiFiles(path.join(projectPath, "src/api"));

  // Create queryClient.js and useAuth.js
  createReactQueryFiles(path.join(projectPath, "src"), projectConfig);

  // Create or overwrite index.js file
  createOrUpdateIndexFile(path.join(projectPath, "src"), projectConfig);

  // Ensure components directory exists
  const componentsDir = path.join(projectPath, "src/components");
  fs.mkdirSync(componentsDir, { recursive: true });

  // Create or update Login.js, Register.js, and App.js
  fs.writeFileSync(path.join(componentsDir, "Login.js"), loginJsContent);
  fs.writeFileSync(path.join(componentsDir, "Register.js"), registerJsContent);
  fs.writeFileSync(path.join(projectPath, "src/App.js"), appJsContent);

  // Add the script to generate API files in backend.
  const templateGenerateApiFilesPath = path.join(
    __dirname,
    "../templates/generateApiFilesTemplate.js"
  );
  const generateApiFilesTemplate = fs.readFileSync(
    templateGenerateApiFilesPath,
    "utf8"
  );

  const backendScriptsDir = path.join(projectPath, "../backend/scripts");
  if (!fs.existsSync(backendScriptsDir)) {
    fs.mkdirSync(backendScriptsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(backendScriptsDir, "generateApiFiles.js"),
    generateApiFilesTemplate
  );

  // Update backend package.json to include the script
  const backendPackageJsonPath = path.join(
    projectPath,
    "../backend/package.json"
  );
  const backendPackageJson = JSON.parse(
    fs.readFileSync(backendPackageJsonPath, "utf8")
  );

  backendPackageJson.scripts = {
    ...backendPackageJson.scripts,
    "generate-api-files": "node scripts/generateApiFiles.js",
  };

  fs.writeFileSync(
    backendPackageJsonPath,
    JSON.stringify(backendPackageJson, null, 2)
  );

  console.log("Script to generate API files added to backend/package.json.");
};

module.exports = { setupReactProject };
