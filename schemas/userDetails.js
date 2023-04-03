const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
