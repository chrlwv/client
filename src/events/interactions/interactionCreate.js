module.exports = class interactionCreate extends Event {
  constructor() {
    super({
      name: "interactionCreate",
      once: false,
    });
  }
  async exec(interaction) {
    try {
      const data = {};
      data.guild = await this.client.findGuild({
        guildID: interaction.guildId,
      });
      if (interaction.isCommand())
        return this.client.emit("slashCommands", interaction, data);
      if (interaction.isContextMenu())
        return this.client.emit("slashCommands", interaction, data);
    } catch (err) {
      interaction.reply({ ephemeral: true, content: "I got an error!" });
      return this.client.logger.error(`An error occured: ${err.message}`, {
        tag: "Interaction",
      });
    }
  }
};