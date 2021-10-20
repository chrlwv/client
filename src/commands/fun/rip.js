/** @format */

const Canvas = require("canvas");
const fs = require("fs");
const path = require("path");
const { MessageAttachment } = require("discord.js");

module.exports = class Rip extends Command {
	constructor() {
		super({
			name: "rip",
			aliases: ["dead"],
			description: "Create a new canva with Rip Meme style.",
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
    
            const backgroundRip = fs.readFileSync(
                path.join(__dirname, "..", "..", "assets", "rip.png")
            );
    
            const bg = await Canvas.loadImage(backgroundRip);
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

            const name = member.user.username;
    
            ctx.font = `bold 60px sans-serif`;
            ctx.fillStyle = `#546880`;
            ctx.fillText(`${name}`, 232, 234, 234);
    
            const avatar = await Canvas.loadImage(
                member.user.displayAvatarURL({ format: "png" })
            );
            ctx.drawImage(avatar, 210, 256, 231, 227);
    
            const attachment = new MessageAttachment(
			canvas.toBuffer(),
			"rip.png"
		);
            message.reply({
                conent: "rip canva",
                files: [attachment],
            });
	}
};
