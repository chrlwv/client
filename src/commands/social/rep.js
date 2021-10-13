/** @format */

const ms = require("ms");

module.exports = class Reputation extends Command {
	constructor() {
		super({
			name: "rep",
			aliases: ["reputation"],
			description: "Give a reputation point to a mentioned user.",
			usage: "<user>",
			category: "Social",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args) {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(m) =>
					m.displayName.toLowerCase().includes(args[0]) ||
					m.user.tag.toLowerCase().includes(args[0])
			) ||
			message.member;

		const timeout = 86400000;
		const amount = 1;
		const { user } = await this.client.getUserById(message.author.id);
		const rep = user.rep_cooldown;

		const { user: receiver } = await this.client.getUserById(member.id);
		const { user: sender } = await this.client.getUserById(message.author.id);

		if (!member) {
			return message.reply("Please mention a user and make sure it's not you.");
		}

		if (receiver.userId === sender.userId) {
			return message.reply(
				"You cannot give yourself an extra reputation point."
			);
		}

		if (rep !== null && timeout - (Date.now() - rep) > 0) {
			let time = ms(timeout - (Date.now() - rep), { long: true });

			message.reply(
				`You've already used the **rep command** recently, \`${time}\` remaining.`
			);
		} else {
			this.client.updateUserById(member.id, {
				reputation: receiver.reputation + amount,
			});

			this.client.updateUserById(message.author.id, {
				rep_cooldown: Date.now(),
			});

			message.reply(
				`<:charliewave_rep:778610398928568330> You gave a reputation point to ${member.user.tag}!`
			);
		}
	}
};
