/** @format */

const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, Canvas } = require("canvas");

const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));
const splice = (s) => (s.length > 40 ? `${s.substring(0, 50)}\n...` : s);

module.exports = class Profile extends Command {
	constructor() {
		super({
			name: "profile",
			aliases: ["me"],
			description:
				"Create the canva profile statistics for the exp & coins ecosystem.",
			usage: "<user>",
			category: "Social",
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

		const { user } = await this.client.getUserById(member.id);
		const { coins, bank, exp, about, reputation } = user;
		const level = calculateUserXp(exp);
		const coins_total = coins + bank;

		const canvas = createCanvas(2000, 2000);
		const ctx = canvas.getContext("2d");

		ctx.patternQuality = "bilinear";
		ctx.filter = "bilinear";
		ctx.antialias = "subpixel";
		ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 5;

		const backgroundProfile = fs.readFileSync(
			path.join(__dirname, "..", "..", "assets", "profile.png")
		);

		const background = await loadImage(backgroundProfile);

		ctx.drawImage(background, 0, 0, 2000, 2000);

		const avatar = await loadImage(
			member.user.displayAvatarURL({ format: "png" })
		);

		ctx.drawImage(avatar, 117, 420, 550, 550);

		ctx.font = "bold 124px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText(`LEVEL`, 1425, 280);

		ctx.font = "bold 286px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.textAlign = "center";
		ctx.fillText(level, 1625, 520);

		ctx.font = "bold 110px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.textAlign = "left";
		ctx.fillText(member.user.username, 810, 814);

		ctx.font = "69px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText(`#${member.user.discriminator}`, 810, 899);

		ctx.font = "bold 75px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.textAlign = "left";
		ctx.fillText(`About`, 98, 1250);

		ctx.font = "69px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText(`${splice(about).toString()}`, 98, 1390);

		const coinsAsset = fs.readFileSync(
			path.join(__dirname, "..", "..", "assets", "coins.png")
		);

		const coins_badge = await loadImage(coinsAsset);
		ctx.drawImage(coins_badge, 117, 1700, 124, 124);
		ctx.font = "bold 75px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.textAlign = "left";
		ctx.fillText(`Coins`, 273, 1760);

		ctx.font = "64px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText(`${coins_total.toLocaleString()}`, 273, 1850);

		const repAsset = fs.readFileSync(
			path.join(__dirname, "..", "..", "assets", "reputation.png")
		);

		const reputation_badge = await loadImage(repAsset);
		ctx.drawImage(reputation_badge, 1095, 1700, 124, 124);
		ctx.font = "bold 75px Arial";
		ctx.fillStyle = "#fcbf60";
		ctx.textAlign = "left";
		ctx.fillText(`Reputation`, 1230, 1760);

		ctx.font = "64px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.fillText(`${reputation.toLocaleString()}`, 1230, 1850);

		let canvas2 = new Canvas(2000, 2000);
		let ctx2 = canvas2.getContext("2d");

		ctx2.drawImage(canvas, 0, 0, 2000, 2000);

		const attachment = new Discord.MessageAttachment(
			canvas2.toBuffer(),
			"profilecard.png"
		);

		message.reply({
			conent: "profile canva",
			files: [attachment],
		});
	}
};
