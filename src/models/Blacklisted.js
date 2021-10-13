/** @format */

const { Schema, model } = require("mongoose");

module.exports = model(
	"Blacklisted",
	new Schema({
		userId: { type: String, required: true },
	})
);
