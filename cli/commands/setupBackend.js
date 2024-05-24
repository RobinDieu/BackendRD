const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");
const selfsigned = require("selfsigned");
const {
  serverJsWithoutHttpsContent,
  envBackupContent,
} = require("../utils/helpers");

const setupBackendProject = (projectPath, projectConfig) => {
  console.log("Setting up Backend project...");

  const projectPathArray = projectPath.split(path.sep);
  const projectName = projectPathArray[projectPathArray.length - 2];

  // Clone the backend repository
  spawn.sync(
    "git",
    ["clone", "https://github.com/RobinDieu/BackendRD.git", projectPath],
    { stdio: "inherit" }
  );

  // Navigate to project directory
  process.chdir(projectPath);

  // Install dependencies
  spawn.sync("npm", ["install"], { stdio: "inherit" });

  // Create .env file

  fs.writeFileSync(
    path.join(projectPath, ".env"),
    envBackupContent(projectName)
  );

  // Generate self-signed certificates
  const certs = selfsigned.generate(null, { days: 365 });
  const certsDir = path.join(projectPath, "cert");
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(certsDir, "cert.pem"), certs.cert);
  fs.writeFileSync(path.join(certsDir, "key.pem"), certs.private);

  if (projectConfig.react) {
    fs.writeFileSync(
      path.join(projectPath, "server.js"),
      serverJsWithoutHttpsContent
    );
  }

  console.log("Backend project setup complete.");
};

module.exports = { setupBackendProject };
