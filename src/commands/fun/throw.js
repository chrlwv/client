const Canvas = require("canvas");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const {
	MessageAttachment
} = require("discord.js");

require("moment-duration-format");

module.exports = class Throw extends Command {
	constructor() {
		super({
			name: "throw",
			aliases: ["garbage"],
			description: "Create a new canva with Throw Meme style.",
			usage: "<user>",
			category: "Fun",
			ownerOnly: false,
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
			);

		if (!member) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}throw <user>\``
			);
		}

		if (member.user.id === message.author.id) {
			return message.reply('You cannot throw yourself.')
		}

		const canvas = Canvas.createCanvas(630, 680);
		const ctx = canvas.getContext("2d");

		const backgroundThrow = fs.readFileSync(
			path.join(__dirname, "..", "..", "assets", "throw.png")
		);

		const bg = await Canvas.loadImage(backgroundThrow);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

		const AuthorAvatar = await Canvas.loadImage(
			message.author.displayAvatarURL({
				format: "png"
			})
		);
		ctx.drawImage(AuthorAvatar, 68, 160, 70, 70);
		ctx.drawImage(AuthorAvatar, 410, 60, 160, 160);

		const MemberAvatar = await Canvas.loadImage(
			member.user.displayAvatarURL({
				format: "png"
			})
		);
		ctx.drawImage(MemberAvatar, 112.4, 222.3, 40, 40);
		ctx.drawImage(MemberAvatar, 518.7, 205, 92, 93);
		ctx.drawImage(MemberAvatar, 367, 420.4, 30, 30);

		const discordAsset = fs.readFileSync(
			path.join(__dirname, "..", "..", "assets", "discord.png")
		);

		const discordIcon = await Canvas.loadImage(discordAsset);
		ctx.drawImage(discordIcon, 182, 168, 85, 85);
		ctx.drawImage(discordIcon, 430.2, 434, 140, 140);

		const createdAt = moment
			.duration(Date.now() - member.user.createdTimestamp)
			.format(`M`);
		ctx.font = this.constructor.applyText(canvas, createdAt);
		ctx.fillStyle = "#040404";
		ctx.fillText(createdAt, 145, 96, 160);

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			"throw.png"
		);

		message.reply({
			conent: "throw canva",
			files: [attachment],
		});

	}

	static applyText(canvas, text) {
		const ctx = canvas.getContext("2d");
		let fontSize = 39;
		do {
			ctx.font = `${(fontSize -= 7)}px sans-serif`;
		} while (ctx.measureText(text).width > canvas.width - 300);
		return ctx.font;
	}
};