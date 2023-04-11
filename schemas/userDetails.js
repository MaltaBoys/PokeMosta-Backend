const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
      default: "User" + Math.floor(Math.random() * 1000000000) + 1,
      unique: true,
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
      default: "shorturl.at/iFZ35", // Default profile picture
    },
    bannerPic: {
      type: String,
      required: false,
      default: "shorturl.at/iFZ35", // Default banner picture
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
