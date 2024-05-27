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
      reportUri: "/report-csp-violation",
      upgradeInsecureRequests: true,
      workerSrc: false,
    },
  },
  expectCt: {
    enforce: true,
    maxAge: 30, // 30 minutes
  },
});

module.exports = helmetMiddleware;
