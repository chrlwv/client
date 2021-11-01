/** @format */

const { parse } = require("twemoji-parser");

module.exports = class Emoji extends Command {
	constructor() {
		super({
      name: "emoji",
      aliases: ["emojiadd"],
      description: "Create an emoji from a different server.",
      usage: "<emoji> <emoji_name>",
      category:
        "<:charliewave_advanced_moderator:857930973715103775> Moderator",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_EMOJIS_AND_STICKERS"],
      clientPerms: ["MANAGE_EMOJIS_AND_STICKERS"],
    });
	}
	async exec(message, args, data) {
		const emoji = args[0];

		if (!emoji) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}emoji <emoji> <emoji_name>\``
			);
		}

		let customEmoji = Discord.Util.parseEmoji(emoji);
		if (customEmoji.id) {
			const Link = `https://cdn.discordapp.com/emojis/${customEmoji.id}.${
				customEmoji.animated ? "gif" : "png"
			}`;

			const name = args.slice(1).join(" ");
			message.guild.emojis.create(
				`${Link}`,
				`${name || `${customEmoji.name}`}`
			);

			return message.reply(`Successfully created \`${name}\` emoji.`);
		} else {
			let checkEmoji = parse(emoji, { assetType: "png" });
			if (!checkEmoji[0]) {
				return message.channel.send("Invalid emoji assetType.");
			}

			return message.reply("This is already a free-to-use emoji.");
		}
	}
};
