const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/User");
const oauthConfig = require("./oauth");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Google Strategy
if (oauthConfig.google.clientID && oauthConfig.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: oauthConfig.google.clientID,
        clientSecret: oauthConfig.google.clientSecret,
        callbackURL: "/auth/google/callback",
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}

// Facebook Strategy
if (oauthConfig.facebook.appID && oauthConfig.facebook.appSecret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: oauthConfig.facebook.appID,
        clientSecret: oauthConfig.facebook.appSecret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "emails", "name"],
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });
          if (!user) {
            user = new User({
              facebookId: profile.id,
              email: profile.emails[0].value,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}

// Microsoft Strategy
if (oauthConfig.microsoft.clientID && oauthConfig.microsoft.clientSecret) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: oauthConfig.microsoft.clientID,
        clientSecret: oauthConfig.microsoft.clientSecret,
        callbackURL: "/auth/microsoft/callback",
        scope: ["user.read"],
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({ microsoftId: profile.id });
          if (!user) {
            user = new User({
              microsoftId: profile.id,
              email: profile.emails[0].value,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}

// GitHub Strategy
if (oauthConfig.github.clientID && oauthConfig.github.clientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: oauthConfig.github.clientID,
        clientSecret: oauthConfig.github.clientSecret,
        callbackURL: "/auth/github/callback",
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            user = new User({
              githubId: profile.id,
              email: profile.emails[0].value,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}

module.exports = passport;
