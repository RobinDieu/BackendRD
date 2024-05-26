const spawn = require("cross-spawn");

const setupMantine = (projectPath) => {
  console.log("Setting up Mantine...");

  // Navigate to project directory
  process.chdir(projectPath);

  // Install Mantine dependencies
  spawn.sync("npm", ["install", "@mantine/core", "@mantine/hooks"], {
    stdio: "inherit",
  });

  console.log("Mantine setup complete.");
};

module.exports = { setupMantine };
