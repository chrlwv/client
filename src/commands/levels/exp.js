/** @format */

module.exports = class Experience extends Command {
	constructor() {
		super({
			name: "exp",
			aliases: ["xp", "experience"],
			description: "Get your current level.",
			usage: "<user>",
			category: "Levels",
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

		if (member.user.bot) {
			return message.reply(
				"There is no data available for Discord Applications."
			);
		}

		const { user } = await this.client.getUserById(member.id);

		message.reply(
			`<:charliewave_exp:771448234672521236> ${
				member.user.tag
			} has earned **${user.exp.toLocaleString()}** xp points.`
		);
	}
};
