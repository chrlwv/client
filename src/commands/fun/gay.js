const DIG = require("discord-image-generation");
const {
	MessageAttachment
} = require("discord.js");

module.exports = class Gay extends Command {
	constructor() {
		super({
			name: "gay",
			aliases: ["rainbow"],
			description: "Create a new canva with Gay/Rainbow Meme style.",
			usage: "<user>",
			category: "Fun",
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

		let img = await new DIG.Gay().getImage(avatar);

		let attachment = new MessageAttachment(img, "gay-meme.png");

		message.reply({
			conent: "gay meme canva",
			files: [attachment],
		});
	}
};