const path = require("path");
const fs = require("fs");

const listRoutes = async () => {
  const routesFilePath = path.resolve(__dirname, "../config/routes.json");

  fs.readFile(routesFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Failed to read routes file: ${err.message}`);
      process.exit(1);
    }
    const routes = JSON.parse(data).routes;
    console.log("Backend Routes:");
    routes.forEach((route) => {
      console.log(
        `${route.method} ${route.path} - ${route.description} (${route.access})`
      );
    });
  });
};

module.exports = { listRoutes };
