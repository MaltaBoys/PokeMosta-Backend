const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../schemas/userDetails.js");

require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const oldEmail = await userModel.findOne({ email });

    // Check if user already exists
    if (oldEmail) {
      return res.status(409).json({
        status: "error",
        message: "Email already in use",
        type: "emailInUse",
      });
    }

    // Check if password is too short
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password is too short",
        type: "passwordTooShort",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Passwords do not match",
        type: "passwordDontMatch",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      email,
      password: encryptedPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  try {
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        type: "userNotFound",
      });
    }

    // Check if password is correct
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, profilePic: user.profilePic },
        JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Store token in cookie
      return res.json({ status: "ok", token: token });
    } else {
      res.status(401).json({
        status: "error",
        message: "Incorrect password",
        type: "incorrectPassword",
      });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Show user details
router.post("/userData", async (req, res) => {

  const { token } = req.body;
  const user = jwt.verify(token, JWT_SECRET);

  try {
    const user = jwt.verify(token, JWT_SECRET);

    const userEmail = user.email;
    const userData = await userModel.findOne({ email: userEmail });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User data retrieved successfully", data: userData });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
