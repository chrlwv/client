/** @format */

module.exports = class Unban extends Command {
	constructor() {
		super({
			name: "unban",
			aliases: [],
			description: "Unban a user from the current guild.",
			usage: "<user_id> <reason>",
			category: "<:charliewave_advanced_moderator:857930973715103775> Moderator",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}
	async exec(message, args, data) {
		let member = args[0];
		let reason = args.slice(1).join(" ");

		if (!member) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}unban <user_id> <reason>\``
			);
		}

		if (!reason) reason = "no reason";

		const bannedUser = await message.guild.members.unban(member, reason);

		message.channel.send(
			`Successfully unbanned ${bannedUser.tag}, reason: ${reason}`
		);
	}
};
