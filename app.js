const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cors());


const mongoUrl = `mongodb+srv://adr1:gdu22nAdr0HAs8Kt@cluster0.stklc1r.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log("Error connecting to MongoDB", e.message);
  });

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

//Register a new user
const { userModel } = require("./schemas/userDetails.js");

app.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const oldEmail = await userModel.findOne({ email });

    // Check if user already exists
    if (oldEmail) {
      return res
        .status(409)
        .json({
          status: "error",
          message: "Email already in use",
          type: "emailInUse",
        });
    }

    // Check if password is too short
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Password is too short",
          type: "passwordTooShort",
        });
    }

    console.log(password, confirmPassword);
    // Check if passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({
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
