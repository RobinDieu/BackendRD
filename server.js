const fs = require("fs");
const https = require("https");
const path = require("path");
const app = require("./app");
const logger = require("./config/logger");
require("dotenv").config();

// HTTPS setup
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
};

// Start server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
