/** @format */

module.exports = class Year extends Command {
	constructor() {
		super({
			name: "year",
			aliases: ["year-progress"],
			description: "Responds with the progress of the current year.",
			usage: "",
			category: "<:charliewave_general:771633361340727336> Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message) {
		const today = new Date();
		const start = new Date(today.getFullYear(), 0, 1);
		const end = new Date(today.getFullYear() + 1, 0, 1);
		const percent = (Math.abs(today - start) / Math.abs(end - start)) * 100;

		return message.reply(
			`<:charliewave_calendar:826015486705401886> The year \`${today
				.getFullYear()
				.toFixed()}\` is \`${percent}%\` complete!`
		);
	}
};
