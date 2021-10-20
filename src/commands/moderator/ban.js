/** @format */

module.exports = class Ban extends Command {
	constructor() {
		super({
			name: "ban",
			aliases: ["tempban"],
			description: "Ban a user from the current guild.",
			usage: "<user> <days> <reason>",
			category: "<:charliewave_advanced_moderator:857930973715103775> Moderator",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}
	async exec(message, args, data) {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(m) =>
					m.displayName.toLowerCase().includes(args[0]) ||
					m.user.tag.toLowerCase().includes(args[0])
			);

		let reason = args.slice(2).join(" ");
		let days = args[1];

		if (!args.length) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}ban <user> <days> <reason>\``
			);
		}

		if (!member) {
			return message.reply("This user is no longer on this guild.");
		}

		if (!reason) reason = "no reason";
		if (!days) days = 7;

		if (!member.bannable) {
			return message.reply("I am not able to ban this user.");
		}

		await message.guild.members.ban(member, { days: days, reason: reason });

		message.reply(
			`${message.author.tag} banned ${member.user.tag} for ${days} days, reason: ${reason}`
		);
	}
};
