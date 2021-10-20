/** @format */

const Topgg = require(`@top-gg/sdk`);

module.exports = class Vote extends Command {
	constructor() {
		super({
			name: "vote",
			aliases: ["topgg"],
			description: "<:topggvote:806573769485320312> Vote Charliewave on top.gg website.",
			usage: "",
			category: "<:charliewave_general:771633361340727336> Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message) {
		const api = new Topgg.Api(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3MjQ5Nzc4OTU2MTIwODg3MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjEyMzc2ODYyfQ.5IuRwHOUflxD142D7jiHyGZFMEB1WNcyughGLrpNq9Q"
		);

		api.hasVoted(message.author.id).then((votes) => {
			if (votes == false) {
				message.reply(`It looks like you didn't vote today. You should check our bot on https://top.gg/bot/772497789561208872/vote`);
			} else {
				message.reply("You've already submitted a vote today. Try again later.");
			}
		});
	}
};
