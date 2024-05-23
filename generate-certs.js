const fs = require("fs");
const path = require("path");
const selfsigned = require("selfsigned");

// Generate self-signed certificates
const certs = selfsigned.generate(null, { days: 365 });
const certsDir = path.join(__dirname, "certs");

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Write the certificates to files
fs.writeFileSync(path.join(certsDir, "cert.pem"), certs.cert);
fs.writeFileSync(path.join(certsDir, "key.pem"), certs.private);

console.log("SSL certificates generated successfully in the certs directory.");
