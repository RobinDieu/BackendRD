const getProjectConfig = (projectTypes) => {
  const projectConfig = {
    react: false,
    electron: false,
    backend: false,
    mantine: false,
  };

  projectTypes.forEach((type) => {
    switch (type.toLowerCase()) {
      case "react":
        projectConfig.react = true;
        break;
      case "electron":
        projectConfig.electron = true;
        break;
      case "backend":
        projectConfig.backend = true;
        break;
      case "mantine":
        projectConfig.mantine = true;
        break;
      default:
        break;
    }
  });

  return projectConfig;
};

module.exports = {
  getProjectConfig,
};
