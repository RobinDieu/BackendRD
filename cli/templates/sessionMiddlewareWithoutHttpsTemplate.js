const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redisClient = require("redis").createClient();
require("dotenv").config();

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || "your_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Change to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});

module.exports = sessionMiddleware;
