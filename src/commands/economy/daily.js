const ms = require("ms");

module.exports = class Daily extends Command {
	constructor() {
		super({
			name: "daily",
			aliases: ["bonus"],
			description: "Get your daily bonus worth of coins.",
			usage: "",
			category: "Economy",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args) {
		const {
			user
		} = await this.client.getUserById(message.author.id);
		const timeout = 86400000;
		const amount = Math.floor(Math.random() * 500) + 1;
		const daily = user.daily_cooldown;

		if (daily !== null && timeout - (Date.now() - daily) > 0) {
			let time = ms(timeout - (Date.now() - daily), {
				long: true
			});

			message.reply(`You've already collected your daily reward recently, \`${time}\` remaining.`);
		} else {
			this.client.updateUserById(message.author.id, {
				daily_cooldown: Date.now(),
				coins: user.coins + amount,
			});

			message.channel.send(`You've successfully collected your daily bonus worth of \`${amount.toLocaleString()}\` coins.`);
		}
	}
};