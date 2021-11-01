/** @format */

module.exports = class SlashPing extends Interaction {
	constructor() {
		super({
      name: "ping",
      description: "Latency, API response and database ping times.",
    });
	}
	async exec(interaction) {
		interaction.reply({
			ephemeral: true,
			content: [
				`latency: **${Math.round(
					interaction.createdTimestamp - Date.now()
				)}**ms`,
				`api response: **${Math.round(this.client.ws.ping)}**ms`,
				`database latency: **${Math.round(
					await this.client.databasePing()
				)}**ms`,
			].join("\n"),
		});
	}
};
