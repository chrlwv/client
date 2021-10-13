/** @format */

const { Schema, model } = require("mongoose");

module.exports = model(
	"Warnings",
	new Schema({
		userId: { type: String, required: true },
		guildId: { type: String, required: true },
		reason: { type: String, default: null },
		date: { type: Number, default: () => Date.now() },
	})
);
