const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");
const selfsigned = require("selfsigned");

const setupBackendProject = (projectPath) => {
  console.log("Setting up Backend project...");

  const projectPathArray = projectPath.split(path.sep);
  const projectName = projectPathArray[projectPathArray.length - 1];

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
  const envContent = `
MONGO_URI=mongodb://localhost:27017/${projectName}
JWT_SECRET=YOU_SHOULD_CHANGE_THIS
API_KEY=YOU_SHOULD_CHANGE_THIS_TOO
SESSION_SECRET=YOU_SHOULD_CHANGE_THIS_TOO_AS_WELL

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# CORS Origin
CORS_ORIGIN=http://localhost:3000

# Base URL
BASE_URL=https://localhost:5000/api
`;
  fs.writeFileSync(path.join(projectPath, ".env"), envContent);

  // Generate self-signed certificates
  const certs = selfsigned.generate(null, { days: 365 });
  const certsDir = path.join(projectPath, "cert");
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(certsDir, "cert.pem"), certs.cert);
  fs.writeFileSync(path.join(certsDir, "key.pem"), certs.private);

  console.log("Backend project setup complete.");
};

module.exports = { setupBackendProject };
