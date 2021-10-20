/** @format */

const figlet = require("figlet");

module.exports = class Ascii extends Command {
	constructor() {
		super({
			name: "ascii",
			aliases: ["figlet", "ascii-figlet", "asciifiglet"],
			description: "Transform text to ascii.",
			usage: "<text>",
			category: "<:charliewave_fun:771633587246202910> Fun",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		const text = args.join(" ");

		if (!text) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}ascii <text>\``
			);
		}

		figlet.text(text, (e, txt) => {
			if (e) return;
			message.channel.send(`\`\`\` ${txt.trimRight()} \`\`\``);
		});
	}
};
