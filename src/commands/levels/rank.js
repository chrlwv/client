/** @format */

const Canvas = require("canvas");
const ssn = require("short-string-number");
const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");

const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));

module.exports = class Rank extends Command {
	constructor() {
		super({
			name: "rank",
			aliases: ["level", "lvl"],
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

		const level = calculateUserXp(user.exp);

		var minxp = (level * level) / 0.01;
		var maxxp = ((level + 1) * (level + 1)) / 0.01;

		const canvas = Canvas.createCanvas(1026, 285);
		const ctx = canvas.getContext("2d");

		const backgroundLevel = fs.readFileSync(
			path.join(__dirname, "..", "..", "assets", "level.png")
		);

		const background = await Canvas.loadImage(backgroundLevel);

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#555555";
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#555555";
		ctx.fillRect(0, 270, 1026, 20);
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.strokeReact = (0, 270, 1026, 20);
		ctx.stroke();

		ctx.fillStyle = "#fcbf60";
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 270, ((user.exp - minxp) / (maxxp - minxp)) * 1026, 20);
		ctx.fill();
		ctx.globalAlpha = 1;

		ctx.font = "25px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(`${ssn(user.exp)}/${ssn(maxxp)}`, 780, 160);

		ctx.textAlign = "center";
		ctx.font = "bold 25px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.fillText(`XP`, 780, 140);

		ctx.textAlign = "center";
		ctx.font = "bold 25px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.fillText(`LEVEL`, 580, 140);

		ctx.font = "25px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(`${level}`, 580, 160);

		ctx.font = "bold 32px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.textAlign = "left";
		ctx.fillText(`${member.user.username}`, 380, 140);

		ctx.font = "24px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText(`#${member.user.discriminator}`, 380, 160);

		ctx.arc(170, 135, 125, 0, Math.PI * 2, true);
		ctx.lineWidth = 6;
		ctx.strokeStyle = "#fcbf60";
		ctx.stroke();
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(
			member.user.displayAvatarURL({ format: "png" })
		);
		ctx.drawImage(avatar, 45, 10, 250, 250);

		const attachment = new Discord.MessageAttachment(
			canvas.toBuffer(),
			"rankcard.png"
		);

		message.reply({
			conent: "rank canva",
			files: [attachment],
		});
	}
};
