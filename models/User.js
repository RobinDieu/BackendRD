const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("../config/logger");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["user"],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  microsoftId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    logger.info(`Generated salt for user: ${this.email}`);
    logger.info(`Generated hashed password for user: ${this.email}`);
    this.password = hashedPassword;
    next();
  } catch (err) {
    logger.error(
      `Error hashing password for user: ${this.email} - ${err.message}`
    );
    next(err);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    logger.info(`Comparing password for user: ${this.email}`);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    if (!isMatch) {
      logger.warn(`Password comparison failed for user: ${this.email}`);
    } else {
      logger.info(`Password comparison succeeded for user: ${this.email}`);
    }
    return isMatch;
  } catch (err) {
    logger.error(
      `Error comparing password for user: ${this.email} - ${err.message}`
    );
    throw err;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
