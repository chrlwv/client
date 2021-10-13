/** @format */

module.exports = class Add extends Command {
	constructor() {
		super({
			name: "add",
			aliases: ["set"],
			description: "Add command",
			usage: "<user> <type> <value>",
			category: "Owner",
			ownerOnly: true,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
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
			) ||
			message.member;

		if (member.bot) {
			return message.reply("You cannot give value for Discord applications.");
		}

		const value = args[2];
		const type = args[1];

		if (!value) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}add <user> <type> <value>\``
			);
		}

		switch (type) {
			case "exp": {
				const { user } = await this.client.getUserById(member.id);

				await this.client.updateUserById(member.id, {
					exp: user.exp + Number(value),
				});

				return message.reply(
					`Successfully added \`${value}\` exp to ${member.user.tag}`
				);
			}
			case "coins": {
				const { user } = await this.client.getUserById(member.id);

				await this.client.updateUserById(member.id, {
					bank: user.bank + Number(value),
				});
				return message.reply(
					`Successfully added \`${value}\` coins to ${member.user.tag}`
				);
			}
			case "reputation": {
				const { user } = await this.client.getUserById(member.id);

				await this.client.updateUserById(member.id, {
					reputation: user.reputation + Number(value),
				});
				return message.reply(
					`Successfully added \`${value}\` reputation points to ${member.user.tag}`
				);
			}
			default: {
				return message.reply(`${type} is not a valid type.`);
			}
		}
	}
};
