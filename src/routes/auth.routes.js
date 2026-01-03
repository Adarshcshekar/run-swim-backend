const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* SIGNUP */
router.post("/register", async (req, res) => {
  try {
    // 1. Validate request body
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { email, password } = req.body;

    // 2. Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 3. Check email format (basic)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // 4. Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 6. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 7. Save user
    const user = new User({
      email,
      password: hashed,
    });

    await user.save();

    // 8. Success response
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    // 9. Log error (IMPORTANT for Render)
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    // 1. Validate body
    if (!req.body) {
      return res.status(400).json({
        message: "Request body missing",
      });
    }

    const { email, password } = req.body;

    // 2. Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 3. Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Do NOT reveal whether email exists
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 5. Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing in env");
      return res.status(500).json({
        message: "Server misconfiguration",
      });
    }

    // 6. Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // IMPORTANT
    });

    // 7. Success response
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
