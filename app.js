const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

const mongoUrl =
  "mongodb+srv://adr1:gdu22nAdr0HAs8Kt@cluster0.stklc1r.mongodb.net/?retryWrites=true&w=majority";

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
  const { username, email, password } = req.body;
  try {
    await userModel.create({
      username,
      email,
      password,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});

