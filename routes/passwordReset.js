const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const logger = require("../config/logger");
require("dotenv").config();

// @route   POST /api/password-reset/request
// @desc    Request password reset
// @access  Public
router.post("/request", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(
        `Password reset request failed: User with this email does not exist (${email})`
      );
      return res
        .status(400)
        .json({ msg: "User with this email does not exist" });
    }

    // Create a reset token
    const token = crypto.randomBytes(32).toString("hex");
    const resetToken = new PasswordResetToken({
      userId: user._id,
      token,
    });

    // Save the reset token to the database
    await resetToken.save();

    // Return the token directly (for development purposes)
    logger.info(`Password reset token generated for user: ${email}`);
    res.json({ token });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/password-reset/reset/:token
// @desc    Reset password
// @access  Public
router.post("/reset/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find the reset token
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      logger.warn(`Password reset failed: Invalid or expired token (${token})`);
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Find the user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      logger.warn(
        `Password reset failed: User not found (${resetToken.userId})`
      );
      return res.status(400).json({ msg: "User not found" });
    }

    // Generate a new salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    logger.info(`Generated new salt for user: ${user.email} - ${salt}`);
    logger.info(
      `Generated new hashed password for user: ${user.email} - ${hashedPassword}`
    );

    // Update the user's password directly without triggering the pre('save') hook
    await User.updateOne({ _id: user._id }, { password: hashedPassword });
    logger.info(`New password saved for user: ${user.email}`);

    // Delete the reset token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });
    logger.info(`Password reset token deleted for user: ${user.email}`);

    res.json({ msg: "Password has been reset" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
