const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { userModel } = require('../schemas/userDetails.js');

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const oldEmail = await userModel.findOne({ email });

    // Check if user already exists
    if (oldEmail) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already in use',
        type: 'emailInUse',
      });
    }

    // Check if password is too short
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is too short',
        type: 'passwordTooShort',
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match',
        type: 'passwordDontMatch',
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      email,
      password: encryptedPassword,
    });
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Login a user

module.exports = router;
