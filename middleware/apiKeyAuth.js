const API_KEY = require("../config/apiKey");

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ msg: "Forbidden: Invalid API key" });
  }
  next();
};

module.exports = apiKeyAuth;
