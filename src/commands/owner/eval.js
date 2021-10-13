/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Eval extends Command {
	constructor() {
		super({
			name: "eval",
			aliases: ["e"],
			description: "Eval command",
			usage: "<code>",
			category: "Owner",
			ownerOnly: true,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		if (!args.join(" "))
			return message.reply(
				`Make sure to assign some input methods.\n\`e.g. ${data.guild?.prefix}eval this.client.users.cache.size\``
			);

		const toEval = args.join(" ");
		try {
			let emb;
			let evaled = await eval(toEval);
			const eevaled = typeof evaled;
			evaled = require("util").inspect(evaled, {
				depth: 0,
				maxArrayLength: null,
			});
			const type = eevaled[0].toUpperCase() + eevaled.slice(1);

			emb = embed()
				.setColor(0x36393e)
				.setTitle("Eval piece")
				.setDescription(
					`\`Type:\` ${type}
        \`Input:\` \`\`\`js\n${toEval} \`\`\`
        \`Output:\` \`\`\`js\n${evaled}\`\`\``
				);

			return message.reply({ embeds: [emb] });
		} catch (error) {
			let embError;
			embError = embed()
				.setColor(0x36393e)
				.setTitle("Eval error")
				.setDescription(`\`\`\`${error}\`\`\``);
			return message.reply({ embeds: [emb] });
		}
	}
};
