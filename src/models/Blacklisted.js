/** @format */

const { Schema, model } = require("mongoose");

module.exports = model(
  "Blacklisted",
  new Schema({
    userName: { type: String, required: true },
    userDiscriminator: { type: String, required: true },
    userId: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Number, default: () => Date.now() },
  })
);
