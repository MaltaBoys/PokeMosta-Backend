const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { userModel } = require("../schemas/userDetails.js");

const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "0&ly%k4b94?^Cy9xZ@7za$DD_(1/dYquT/wH5!!Djiq-gOR7*BQoNr8çVMDMG2Ç};>F+Qi0oSD)eU6<(ATU";

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
          expiresIn: "15m",
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

// Show user details TODO: add token verification
router.post("/userData", async (req, res) => {
/*   const token = req.cookies.token;
 */
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
      type: "unauthorized",
    });
  }

  try {
    const { user } = jwt.verify(token, JWT_SECRET);
    const userEmail = user.email;
    userModel.findOne({ email: userEmail }).then((user) => {
      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
