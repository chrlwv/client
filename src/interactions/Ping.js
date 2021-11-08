/** @format */

module.exports = class SlashPing extends Interaction {
	constructor() {
		super({
      name: "ping",
      description: "Latency, API response and database ping times.",
    });
	}
	async exec(interaction) {
		try {
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
    } catch (err) {
      interaction.reply({ ephemeral: true, content: "I got an error!" });
      return this.client.logger.error(`An error occured: ${err.message}`, {
        tag: "Interaction",
      });
    }
	}
};
