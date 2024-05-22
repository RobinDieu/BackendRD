const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const EmailVerificationToken = require("../models/EmailVerificationToken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// @route   POST /api/email-verification/send
// @desc    Send email verification link
// @access  Public
router.post("/send", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist" });
    }

    // Create a verification token
    const token = crypto.randomBytes(32).toString("hex");
    const verificationToken = new EmailVerificationToken({
      userId: user._id,
      token,
    });

    // Save the verification token to the database
    await verificationToken.save();

    // Send email with verification link
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Email Verification",
      text: `You are receiving this because you (or someone else) have requested the verification of the email for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/api/email-verification/verify/${token}\n\n
      If you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: "Email verification link sent to email" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/email-verification/verify/:token
// @desc    Verify email
// @access  Public
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    // Find the verification token
    const verificationToken = await EmailVerificationToken.findOne({ token });
    if (!verificationToken) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Find the user
    const user = await User.findById(verificationToken.userId);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Verify the user's email
    user.isVerified = true;
    await user.save();

    // Delete the verification token
    await verificationToken.delete();

    res.json({ msg: "Email has been verified" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
