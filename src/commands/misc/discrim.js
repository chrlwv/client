/** @format */

module.exports = class Discriminator extends Command {
	constructor() {
		super({
			name: "discrim",
			aliases: ["discriminator"],
			description:
				"Searches for users with the specified discriminator. (or your own if not specified)",
			usage: "<user>",
			category: "Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args) {
		let discrim = args[0];
		if (!discrim) {
			discrim = message.author.discriminator;
		}
		if (discrim.startsWith("#")) {
			discrim = discrim.slice(1);
		}

		if (/^[0-9]+$/.test(discrim) && discrim.length === 4) {
			const users = this.client.users.cache
				.filter((user) => user.discriminator === discrim)
				.map((user) => user.username);

			const splice = (s) =>
				s.length > 1500 ? `${s.substring(0, 1490)}...` : s;

			if (users.length === 0)
				return message.reply(
					`No user(s) with \`#${discrim}\` discriminator found.`
				);

			return message.reply(
				`**${
					users.length
				}** user(s) found with the discriminator #${discrim}\n\`\`\`yml\n${splice(
					users.join(", ").toString()
				)}\`\`\``
			);
		} else {
			return message.reply("Invalid discriminator provided.");
		}
	}
};
