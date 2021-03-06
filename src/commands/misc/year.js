module.exports = class Year extends Command {
	constructor() {
		super({
			name: "year",
			aliases: ["year-progress"],
			description: "Responds with the progress of the current year.",
			usage: "",
			category: "Misc",
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
			`<:calendar_dark:989567449554903071> The year \`${today
				.getFullYear()
				.toFixed()}\` is \`${percent}%\` complete!`
		);
	}
};