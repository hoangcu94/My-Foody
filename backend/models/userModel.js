const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 5,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 128,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 11,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
