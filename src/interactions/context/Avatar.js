const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class Avatar extends Interaction {
    constructor() {
        super({
            name: "Avatar",
            type: 'USER',
            description: 'Gets Avatar'
        });
    }
    async exec(interaction) {
        try {
          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("LINK")
              .setURL(
                interaction.options
                  .getUser("user")
                  .displayAvatarURL({ dynamic: true, size: 4096 })
              )
              .setLabel("Show")
          );
          interaction.reply({
            content: `${interaction.options
              .getUser("user")
              .displayAvatarURL({ dynamic: true, size: 4096 })}`,
            components: [row],
          });
        } catch (err) {
          interaction.reply({ ephemeral: true, content: "I got an error!" });
          return this.client.logger.error(`An error occured: ${err.message}`, {
            tag: "Interaction",
          });
        }
    }
}