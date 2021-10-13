/** @format */

module.exports = class Kick extends Command {
	constructor() {
		super({
			name: "kick",
			aliases: [],
			description: "Kick a user from the current guild.",
			usage: "<user>",
			category: "Moderator",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["KICK_MEMBERS"],
			clientPerms: ["KICK_MEMBERS"],
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

		let reason = args.slice(1).join(" ");

		if (!args.length) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}kick <user> <reason>\``
			);
		}

		if (!member) {
			return message.reply("This user is no longer on this guild.");
		}

		if (!reason) reason = "no reason";

		if (!member.kickable) {
			return message.reply("I am not able to ban this user.");
		}

		await message.guild.members.kick(member, { reason: reason });

		message.reply(
			`${message.author.tag} kick ${member.user.tag}, reason: ${reason}`
		);
	}
};
