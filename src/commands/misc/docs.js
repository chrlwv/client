/** @format */

const fetch = require("node-fetch");

module.exports = class Docs extends Command {
	constructor() {
		super({
			name: "docs",
			aliases: ["djs"],
			description: "Search queries on discord.js docs.",
			usage: "<query>",
			category: "<:charliewave_general:771633361340727336> Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		const query = args.join(" ");

		if (!query) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}docs <query>\``
			);
		}

		const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
			query
		)}`;

		const dataJson = await fetch(url).then((res) => res.json());

		if (!dataJson) {
			return message.reply(`Cannot find \`${query}\` query in discord.js docs.`);
		}

		const embed = {
			...dataJson,
			author: {},
			color: "#7289DA",
			footer: {
				text: message.author.username,
				icon_url: message.author.displayAvatarURL({ dynamic: true }),
			},
		};

		return message.reply({ embeds: [embed] });
	}
};
