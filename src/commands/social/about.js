/** @format */

module.exports = class About extends Command {
	constructor() {
		super({
			name: "about",
			aliases: ["aboutme", "bio", "setbio"],
			description: "Customize your profile, by setting a new about me text.",
			usage: "<text>",
			category: "Social",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args) {
		if (!args[0]) return message.reply("Please specify a bio.");

		if (args[0]) {
			this.client.updateUserById(message.author.id, {
				about: args.join(" "),
			});

			await message.reply("Successfully **updated** your personal bio.");
		}
	}
};
