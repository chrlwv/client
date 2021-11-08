/** @format */
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class SlashUptime extends Interaction {
  constructor() {
    super({
      name: "uptime",
      description: "Displays bot uptime.",
    });
  }
  async exec(interaction) {
    try {
      const buttonSupport = new MessageButton()
        .setURL("https://discord.gg/RPRfpnM6MZ")
        .setLabel("Support")
        .setStyle("LINK");

      const row = new MessageActionRow().addComponents(buttonSupport);

      return interaction.reply({
        components: [row],
        ephemeral: true,
        content: [
          `client uptime: ${this.constructor.uptime()}`,
          `client status: <:charliewave_online:771635233384693791> online.`,
        ].join("\n"),
      });
    } catch (err) {
      interaction.reply({ ephemeral: true, content: "I got an error!" });
      return this.client.logger.error(`An error occured: ${err.message}`, {
        tag: "Interaction",
      });
    }
  }

  static uptime() {
    var msec = process.uptime().toFixed(0) * 1000;
    var days = Math.floor(msec / 1000 / 60 / 60 / 24);
    msec -= days * 1000 * 60 * 60 * 24;
    var hours = Math.floor(msec / 1000 / 60 / 60);
    msec -= hours * 1000 * 60 * 60;
    var mins = Math.floor(msec / 1000 / 60);
    msec -= mins * 1000 * 60;
    var secs = Math.floor(msec / 1000);
    var timestr = "";
    if (days > 0) {
      timestr += days + "d ";
    }
    if (hours > 0) {
      timestr += hours + "h ";
    }
    if (mins > 0) {
      timestr += mins + "m ";
    }
    if (secs > 0) {
      timestr += secs + "s";
    }
    return timestr;
  }
};
