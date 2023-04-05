const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: false,
      default: "https://i.imgur.com/0y0XQ9A.png",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "UserDetails",
  }
);

const userModel = mongoose.model("UserDetails", UserDetailsSchema);
module.exports = {
  userModel,
};
