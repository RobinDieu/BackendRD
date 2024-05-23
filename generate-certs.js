const fs = require("fs");
const path = require("path");
const selfsigned = require("selfsigned");

// Generate self-signed certificates
const cert = selfsigned.generate(null, { days: 365 });
const certDir = path.join(__dirname, "cert");

// Create certs directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Write the certificates to files
fs.writeFileSync(path.join(certDir, "cert.pem"), certs.cert);
fs.writeFileSync(path.join(certDir, "key.pem"), certs.private);

console.log("SSL certificates generated successfully in the certs directory.");
