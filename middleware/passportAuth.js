const passport = require("../config/passport");

const passportAuth = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = passportAuth;
