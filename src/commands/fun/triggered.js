/** @format */

const DIG = require("discord-image-generation");
const { MessageAttachment } = require("discord.js");

module.exports = class Triggered extends Command {
	constructor() {
		super({
			name: "triggered",
			aliases: ["rage"],
			description: "Create a new canva with Triggered Meme style.",
			usage: "<user>",
			category: "<:charliewave_fun:771633587246202910> Fun",
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

            let avatar = member.user.displayAvatarURL({
                dynamic: false,
                format: "png",
            });
    
            let img = await new DIG.Triggered().getImage(avatar);
    
            let attachment = new MessageAttachment(img, "triggered.gif");
    
            message.reply({
                conent: "triggered canva",
                files: [attachment],
            });
	}
};
