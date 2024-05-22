const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const passport = require("passport");
const { validateRegister, validateLogin } = require("../middleware/validate");
const logger = require("../config/logger");
require("dotenv").config();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validateRegister, async (req, res) => {
  const { email, password, roles } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`User registration failed: User already exists (${email})`);
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    user = new User({
      email,
      password,
      roles: roles || ["user"], // Default to ['user'] if roles are not provided
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        logger.info(`User registered successfully: ${email}`);
        res.json({ token });
      }
    );
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post("/login", validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      logger.warn(`User login failed: Invalid credentials (${email})`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    logger.info(`Comparing password for user: ${email}`);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`User login failed: Incorrect password (${email})`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        logger.info(`User logged in successfully: ${email}`);
        res.json({ token });
      }
    );
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/auth/users
// @desc    Get all users' emails
// @access  Public
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("email -_id");
    res.json(users);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/auth/user
// @desc    Delete a user by email
// @access  Public
router.delete("/user", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      logger.warn(`User deletion failed: User not found (${email})`);
      return res.status(404).json({ msg: "User not found" });
    }

    logger.info(`User deleted successfully: ${email}`);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/auth/user
// @desc    Update a user's email or password
// @access  Public
router.put("/user", async (req, res) => {
  const { email, updateData } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`User update failed: User not found (${email})`);
      return res.status(404).json({ msg: "User not found" });
    }

    if (updateData.email) user.email = updateData.email;
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }

    await user.save();
    logger.info(`User updated successfully: ${email}`);
    res.json({ msg: "User updated successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/auth/user/role
// @desc    Add or remove a role from a user
// @access  Public
router.put("/user/role", async (req, res) => {
  const { email, role, action } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`User role update failed: User not found (${email})`);
      return res.status(404).json({ msg: "User not found" });
    }

    if (action === "add") {
      if (!user.roles.includes(role)) {
        user.roles.push(role);
      }
    } else if (action === "remove") {
      user.roles = user.roles.filter((r) => r !== role);
    }

    await user.save();
    logger.info(`User role updated successfully: ${email}`);
    res.json({ msg: "User role updated successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/auth/admin
// @desc    Admin route
// @access  Private (Admin only)
router.get("/admin", auth, role(["admin"]), async (req, res) => {
  res.json({ msg: "Welcome, Admin!" });
});

// OAuth Routes

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const payload = {
      user: {
        id: req.user.id,
        roles: req.user.roles,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.redirect(`/auth/success?token=${token}`);
      }
    );
  }
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const payload = {
      user: {
        id: req.user.id,
        roles: req.user.roles,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.redirect(`/auth/success?token=${token}`);
      }
    );
  }
);

// Microsoft OAuth
router.get(
  "/microsoft",
  passport.authenticate("microsoft", { scope: ["user.read"] })
);
router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", { session: false }),
  (req, res) => {
    const payload = {
      user: {
        id: req.user.id,
        roles: req.user.roles,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.redirect(`/auth/success?token=${token}`);
      }
    );
  }
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const payload = {
      user: {
        id: req.user.id,
        roles: req.user.roles,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.redirect(`/auth/success?token=${token}`);
      }
    );
  }
);

module.exports = router;
