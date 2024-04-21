const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    student_code: String,
    student_class: String,
    dob: String,
    address: String,
    email: String,
    password: String,
    tokenUser: String,
    result: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;