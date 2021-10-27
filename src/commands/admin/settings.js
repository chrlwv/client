/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Settings extends Command {
  constructor() {
    super({
      name: "settings",
      aliases: ["conf", "config", "servconfig", "servconf"],
      description: "Define per-guild settings.",
      usage: "",
      category: "<:charliewave_settings:771462923855069204> Admin",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["ADMINISTRATOR"],
      clientPerms: [],
    });
  }
  async exec(message) {
    const guild = await this.client.getGuildById(message.guild.id);

    const prefix = guild.prefix;
    const levelMsgs = guild?.level_msg_module;
    const antiLinks = guild?.uri_blocker_module;
    const welcomeCh = guild?.welcome_event_module;
    const leaveCh = guild?.leave_event_module;
    const autoRole = guild?.auto_role_module;
    const arole = message.guild.roles.cache.get(autoRole);

    levelMsgs ? "true" : "enabled";
    levelMsgs ? "false" : "disabled";

    antiLinks ? "true" : "enabled";
    antiLinks ? "false" : "disabled";

    let emb;
    emb = embed()
      .setColor(0x36393e)
      .setAuthor(
        `${message.guild.name}`,
        message.guild.iconURL({ dynamic: true, size: 2048 })
      )
      .setDescription("description settings")
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
      .addField("autorole:", autoRole !== null ? `${arole}` : "disabled", true)
      .addField(
        "welcome channel:",
        welcomeCh !== null ? `<#${welcomeCh}>` : "disabled",
        true
      )
      .addField(
        "leave channel:",
        leaveCh !== null ? `<#${leaveCh}>` : "disabled",
        true
      )
      .addField("level up messages:", `${levelMsgs}`, true)
      .addField("anti links:", `${antiLinks}`, true)
      .addField("prefix:", `${prefix}`, true);

    return message.reply({ embeds: [emb] });
  }
};
