/** @format */

const { embed } = require("../../utils/Utils");
const { MessageActionRow, MessageButton } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = class Uptime extends Command {
  constructor() {
    super({
      name: "uptime",
      aliases: ["uptime"],
      description: "Displays bot uptime.",
      usage: "",
      category: "<:charliewave_general:771633361340727336> Misc",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
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

    return message.reply({
      components: [row],
      ephemeral: true,
      content: [
        `client uptime: ${uptimeDuration}`,
        `client status: <:charliewave_online:771635233384693791> online.`,
      ].join("\n"),
    });
  }
};
