/** @format */

module.exports = class Prefix extends Command {
	constructor() {
		super({
			name: "prefix",
			aliases: ["pref", "setpref", "setprefix"],
			description: "Change the guild's prefix.",
			usage: "<prefix>",
			category: "<:charliewave_settings:771462923855069204> Admin",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["MANAGE_GUILD"],
			clientPerms: [],
		});
	}
	async exec(message, [prefix], data) {
		if (!prefix)
			return message.reply(`Current guild's prefix: \`${data.guild?.prefix}\``);

		if (prefix.length > 3)
			message.reply(`The prefix cannot be longer than 3 characters.`);

		data.guild.prefix = prefix;
		await data.guild.save();
		return message.reply(`Successfully changed prefix to: \`${prefix}\``);
	}
};
