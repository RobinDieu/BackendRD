const helmet = require("helmet");

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'"],
      styleSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      reportUri: ["/report-csp-violation"],
      upgradeInsecureRequests: [],
      workerSrc: [],
    },
  },
  expectCt: {
    enforce: true,
    maxAge: 30 * 60, // 30 minutes in seconds
  },
});

module.exports = helmetMiddleware;
