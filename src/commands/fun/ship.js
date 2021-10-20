/** @format */

const { createCanvas, loadImage, registerFont } = require("canvas");
const request = require("node-superfetch");
const path = require("path");
const { MessageAttachment } = require("discord.js");

module.exports = class Ship extends Command {
	constructor() {
		super({
			name: "ship",
			aliases: ["love", "loves"],
			description: "Create a new canva with Ship inspired theme.",
			usage: "<user>",
			category: "<:charliewave_fun:771633587246202910> Fun",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
        registerFont(
            path.join(__dirname, "..", "..", "assets", "fonts", "Pinky Cupid.otf"),
            { family: "Pinky Cupid" }
        );

        const percentColors = [
            { pct: 0.0, color: { r: 0, g: 0, b: 255 } },
            { pct: 0.5, color: { r: 255 / 2, g: 0, b: 255 / 2 } },
            { pct: 1.0, color: { r: 255, g: 0, b: 0 } },
        ];

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
                    `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}ship <user>\``
                );
            }
    
            let level = Math.round(Math.random() * 100);
    
            const self = message.author.id === member.user.id;
            const authorUser =
                message.author.id === message.author.id ||
                member.user.id === message.author.id;
    
            const firstAvatarURL = message.author.displayAvatarURL({
                format: "png",
                size: 512,
            });
    
            const secondAvatarURL = member.user.displayAvatarURL({
                format: "png",
                size: 512,
            });
    
            try {
                const firstAvatarData = await request.get(firstAvatarURL);
                const firstAvatar = await loadImage(firstAvatarData.body);
                const secondAvatarData = await request.get(secondAvatarURL);
                const secondAvatar = await loadImage(secondAvatarData.body);
                const base = await loadImage(
                    path.join(__dirname, "..", "..", "assets", "ship.png")
                );
    
                const canvas = createCanvas(base.width, base.height);
                const ctx = canvas.getContext("2d");
                ctx.drawImage(firstAvatar, 70, 56, 400, 400);
                ctx.drawImage(secondAvatar, 730, 56, 400, 400);
                ctx.drawImage(base, 0, 0);
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillStyle = "#ff6c6c";
                ctx.font = "40px Pinky Cupid";
                ctx.fillStyle = "white";
                ctx.fillText(message.author.username, 270, 448);
                ctx.fillText(member.user.username, 930, 448);
                ctx.font = "60px Pinky Cupid";
                ctx.fillStyle = this.constructor.percentColor(level / 100, percentColors);
                ctx.fillText(`${level}%`, 600, 230);
                ctx.fillText(calculateLevelText(level, self, authorUser), 600, 296);
                ctx.font = "90px Pinky Cupid";
                ctx.fillText(level > 49 ? "❤️" : "💔", 600, 100);

                const attachment = new MessageAttachment(
                    canvas.toBuffer(),
                    "ship.png"
                );

                message.reply({
                    conent: "ship canva",
                    files: [attachment],
                });
    
                function calculateLevelText(level, self, authorUser) {
                    if (self) return "Narcissist";
                    if (level === 0) return "Abysmal";
                    if (level > 0 && level < 10) return "Horrid";
                    if (level > 9 && level < 20) return "Awful";
                    if (level > 19 && level < 30) return "Very Bad";
                    if (level > 29 && level < 40) return "Bad";
                    if (level > 39 && level < 50) return "Poor";
                    if (level > 49 && level < 60) return "Average";
                    if (level > 59 && level < 70) {
                        if (level === 69) return "Nice";
                        return "Fine";
                    }
                    if (level > 69 && level < 80) return "Good";
                    if (level > 79 && level < 90) return "Great";
                    if (level > 89 && level < 100) return "Amazing";
                    if (level === 100) return "Soulmates";
                    return "???";
                }
            } catch (err) {
                return message.reply(`Error creating the canva, you can report this error by using \`${data.guild?.prefix}report <your_discover>\`.`);
            }
            
	}

    static percentColor(pct, percentColors) {
        let i = 1;
        for (i; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        const lower = percentColors[i - 1];
        const upper = percentColors[i];
        const range = upper.pct - lower.pct;
        const rangePct = (pct - lower.pct) / range;
        const pctLower = 1 - rangePct;
        const pctUpper = rangePct;
        const color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper)
                .toString(16)
                .padStart(2, "0"),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper)
                .toString(16)
                .padStart(2, "0"),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
                .toString(16)
                .padStart(2, "0"),
        };
        return `#${color.r}${color.g}${color.b}`;
    }
};
