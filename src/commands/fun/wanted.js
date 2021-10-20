/** @format */

const Canvas = require("canvas");
const fs = require("fs");
const path = require("path");
const { MessageAttachment } = require("discord.js");

module.exports = class Wanted extends Command {
	constructor() {
		super({
			name: "wanted",
			aliases: [],
			description: "Create a new canva with Wanted Meme style.",
			usage: "<user>",
			category: "<:charliewave_fun:771633587246202910> Fun",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args) {
        const canvas = Canvas.createCanvas(630, 680);
		const ctx = canvas.getContext("2d");


		const backgroundWanted = fs.readFileSync(
			path.join(__dirname, "..", "..", "assets", "wanted.png")
		);

		const bg = await Canvas.loadImage(backgroundWanted);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(m) =>
					m.displayName.toLowerCase().includes(args[0]) ||
					m.user.tag.toLowerCase().includes(args[0])
			) ||
			message.member;

            const avatar = await Canvas.loadImage(
                member.user.displayAvatarURL({ format: "png" })
            );
            ctx.drawImage(avatar, 199, 210, 231, 227);

            const attachment = new MessageAttachment(
			canvas.toBuffer(),
			"wanted.png"
            );

            message.reply({
                conent: "wanted canva",
                files: [attachment],
            });
	}
};
