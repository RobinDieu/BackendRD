const fs = require("fs");
const path = require("path");
const { readAndWriteTemplate, envReactContent } = require("./index");

const createIndexFileContent = (projectConfig) => {
  let imports = `import React from "react";\nimport { createRoot } from "react-dom/client";\n`;
  let providers = "";
  let appWrapperStart = "";
  let appWrapperEnd = "";

  if (projectConfig.backend) {
    imports += `import { QueryClientProvider } from "@tanstack/react-query";\nimport queryClient from "./queryClient";\n`;
    providers += `  <QueryClientProvider client={queryClient}>\n`;
    appWrapperStart += `  `;
    appWrapperEnd = `  </QueryClientProvider>\n` + appWrapperEnd;
  }

  if (projectConfig.mantine) {
    imports += `import { MantineProvider } from "@mantine/core";\n`;
    providers += `  <MantineProvider withGlobalStyles withNormalizeCSS>\n`;
    appWrapperStart += `  `;
    appWrapperEnd = `  </MantineProvider>\n` + appWrapperEnd;
  }

  const content = `${imports}import App from "./App";\n\nconst container = document.getElementById("root");\nconst root = createRoot(container);\n\nroot.render(\n${providers}${appWrapperStart}<App />\n${appWrapperEnd});\n`;

  return content;
};

const createOrUpdateIndexFile = (srcPath, projectConfig) => {
  const indexPath = path.join(srcPath, "index.js");
  const indexContent = createIndexFileContent(projectConfig);

  fs.writeFileSync(indexPath, indexContent);
};

const createApiFiles = (apiPath) => {
  if (!fs.existsSync(apiPath)) {
    fs.mkdirSync(apiPath, { recursive: true });
  }

  readAndWriteTemplate(
    "authAPIReactTemplate.js",
    path.join(apiPath, "authAPI.js")
  );
  readAndWriteTemplate(
    "axiosInstanceReactTemplate.js",
    path.join(apiPath, "axiosInstance.js")
  );
  readAndWriteTemplate(
    "productAPIReactTemplate.js",
    path.join(apiPath, "productAPI.js")
  );

  console.log("API files created successfully.");
};

const createReactQueryFiles = (srcPath) => {
  const hooksPath = path.join(srcPath, "hooks");
  if (!fs.existsSync(hooksPath)) {
    fs.mkdirSync(hooksPath, { recursive: true });
  }

  readAndWriteTemplate(
    "queryClientReactTemplate.js",
    path.join(srcPath, "queryClient.js")
  );

  readAndWriteTemplate(
    "useAuthReactTemplate.js",
    path.join(hooksPath, "useAuth.js")
  );

  console.log("React Query files created successfully.");
};

const createOrUpdateComponentFiles = (projectPath) => {
  const componentsDir = path.join(projectPath, "src/components");
  fs.mkdirSync(componentsDir, { recursive: true });

  readAndWriteTemplate(
    "LoginComponentReactTemplate.js",
    path.join(componentsDir, "Login.js")
  );
  readAndWriteTemplate(
    "RegisterComponentReactTemplate.js",
    path.join(componentsDir, "Register.js")
  );
  readAndWriteTemplate(
    "AppReactTemplate.js",
    path.join(projectPath, "src", "App.js")
  );
};

const createApiAndQueryFiles = (projectPath, projectConfig) => {
  createApiFiles(path.join(projectPath, "src/api"));
  createReactQueryFiles(path.join(projectPath, "src"));
  createOrUpdateIndexFile(path.join(projectPath, "src"), projectConfig);
};

const createEnvFile = (projectPath) => {
  fs.writeFileSync(path.join(projectPath, ".env"), envReactContent);
};

const updatePackageJsonScripts = (projectPath, projectConfig) => {
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

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
};

const installAdditionalDependencies = () => {
  spawn.sync(
    "npm",
    ["install", "axios", "@tanstack/react-query", "react-router-dom"],
    { stdio: "inherit" }
  );
};

const addApiGenerationScriptToBackend = (projectPath) => {
  const backendScriptsDir = path.join(projectPath, "../backend/scripts");
  if (!fs.existsSync(backendScriptsDir)) {
    fs.mkdirSync(backendScriptsDir, { recursive: true });
  }

  readAndWriteTemplate(
    "generateApiFilesTemplate.js",
    path.join(backendScriptsDir, "generateApiFiles.js")
  );

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

module.exports = {
  createOrUpdateComponentFiles,
  createEnvFile,
  createApiAndQueryFiles,
  updatePackageJsonScripts,
  installAdditionalDependencies,
  addApiGenerationScriptToBackend,
};
