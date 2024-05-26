const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");
const selfsigned = require("selfsigned");
const { envBackupContent } = require("../utils/envUtils");
const { readAndWriteTemplate } = require("../utils/templateUtils");

const cloneBackendRepo = (projectPath) => {
  spawn.sync(
    "git",
    ["clone", "https://github.com/RobinDieu/BackendRD.git", projectPath],
    { stdio: "inherit" }
  );
};

const installDependencies = (projectPath) => {
  process.chdir(projectPath);
  spawn.sync("npm", ["install"], { stdio: "inherit" });
};

const createEnvFileBackend = (projectPath, projectName, protocol) => {
  const envContent = envBackupContent(projectName, protocol);
  fs.writeFileSync(path.join(projectPath, ".env"), envContent);
};

const generateSelfSignedCerts = (projectPath) => {
  const certs = selfsigned.generate(null, { days: 365 });
  const certsDir = path.join(projectPath, "cert");
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(certsDir, "cert.pem"), certs.cert);
  fs.writeFileSync(path.join(certsDir, "key.pem"), certs.private);
};

const setupServerFile = (projectPath, useHttps) => {
  const templateFileName = useHttps
    ? "serverTemplate.js"
    : "serverWithoutHttpsTemplate.js";
  readAndWriteTemplate(templateFileName, path.join(projectPath, "server.js"));
};

module.exports = {
  cloneBackendRepo,
  installDependencies,
  createEnvFileBackend,
  generateSelfSignedCerts,
  setupServerFile,
};
