const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const setupNextProject = (projectPath) => {
  console.log("Setting up Next.js project...");

  // Initialize Next.js app
  execSync(`npx create-next-app@latest ${projectPath}`, { stdio: "inherit" });

  // Navigate to project directory
  process.chdir(projectPath);

  // Install additional dependencies
  execSync("npm install axios", { stdio: "inherit" });

  // Create .env.local file
  const envContent = `NEXT_PUBLIC_API_URL=http://localhost:6969/api\n`;
  fs.writeFileSync(path.join(projectPath, ".env.local"), envContent);

  console.log("Next.js project setup complete.");
};

module.exports = { setupNextProject };
