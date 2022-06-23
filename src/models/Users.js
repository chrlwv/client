const {
	Schema,
	model
} = require("mongoose");

module.exports = model(
	"Users",
	new Schema({
		userId: {
			type: String,
			required: true
		},
		about: {
			type: String,
			default: "mysterious person"
		},
		coins: {
			type: Number,
			default: 0
		},
		bank: {
			type: Number,
			default: 0
		},
		reputation: {
			type: Number,
			default: 0
		},
		exp: {
			type: Number,
			default: 0
		},
		daily_cooldown: {
			type: Number,
			default: null
		},
		weekly_cooldown: {
			type: Number,
			default: null
		},
		fish_cooldown: {
			type: Number,
			default: null
		},
		hunt_cooldown: {
			type: Number,
			default: null
		},
		rep_cooldown: {
			type: Number,
			default: null
		},
		rob_cooldown: {
			type: Number,
			default: null
		},
		report_cooldown: {
			type: Number,
			default: null
		},
	})
);