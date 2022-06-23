const {
	embed
} = require("../../utils/Utils");

module.exports = class Color extends Command {
	constructor() {
		super({
			name: "color",
			aliases: ["randomcolor"],
			description: "Raffle a rancom color.",
			usage: "",
			category: "Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message) {
		const color = Math.floor(Math.random() * 16777215).toString(16);
		const preview = `https://singlecolorimage.com/get/${color}/512x512`;

		let emb;
		emb = embed()
			.setThumbnail(preview)
			.setFooter({
				text: `#${color}`
			})
			.setColor(`#${color}`);

		return message.reply({
			content: "Here is your random color.",
			embeds: [emb]
		});
	}
};