const { execSync } = require("child_process");

const runCommand = (command, options = {}) => {
  try {
    execSync(command, { stdio: "inherit", ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

module.exports = {
  runCommand,
};
