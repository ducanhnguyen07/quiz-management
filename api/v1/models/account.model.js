const mongoose = require("mongoose");
const generate = require("../../../helpers/generate.helper");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    address: String,
    email: String,
    password: String,
    token: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;