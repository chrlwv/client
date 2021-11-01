/** @format */
const { embed } = require("../utils/Utils");
const { MessageActionRow, MessageButton } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = class SlashUptime extends Interaction {
  constructor() {
    super({
      name: "uptime",
      description: "Displays bot uptime.",
    });
  }
  async exec(interaction) {
    const uptimeDuration = moment
      .duration(this.client.uptime)
      .format("Y [years], D [days], H [hours], m [minutes], s [seconds]");

    const buttonSupport = new MessageButton()
      .setURL("https://discord.gg/RPRfpnM6MZ")
      .setLabel("Support")
      .setStyle("LINK");

    const row = new MessageActionRow().addComponents(buttonSupport);

    let emb;
    emb = embed()
      .setColor(0x36393e)
      .setDescription(`uptime: ${uptimeDuration}`);

    return interaction.reply({
      components: [row],
      ephemeral: true,
      content: [
        `client uptime: ${uptimeDuration}`,
        `client status: <:charliewave_online:771635233384693791> online.`,
      ].join("\n"),
    });
  }
};
