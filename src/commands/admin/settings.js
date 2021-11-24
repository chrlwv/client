/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Settings extends Command {
  constructor() {
    super({
      name: "settings",
      aliases: ["conf", "config", "servconfig", "servconf", "cfg"],
      description: "Define per-guild settings.",
      usage: "",
      category: "<:charliewave_settings:771462923855069204> Admin",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_GUILD"],
      clientPerms: [],
    });
  }
  async exec(message) {
    const guild = await this.client.getGuildById(message.guild.id);
    const prefix = guild.prefix;
    const levelMsgs = guild?.level_msg_module;
    const uriBlocker = guild?.uri_blocker_module;
    const welcomeCh = guild?.welcome_event_module;
    const leaveCh = guild?.leave_event_module;
    const autoRole = guild?.auto_role_module;
    const arole = message.guild.roles.cache.get(autoRole);
    const caseLogging = guild?.modLogging.enable;

    let emb;
    emb = embed()
      .setColor(0x36393e)
      .setAuthor(
        `${message.guild.name}`,
        message.guild.iconURL({ dynamic: true, size: 2048 })
      )
      .addField(
        "**WELCOMER:**",
        `welcome channel: ${
          welcomeCh !== null ? `<#${welcomeCh}>` : "disabled"
        } \nleave channel: ${leaveCh !== null ? `<#${leaveCh}>` : "disabled"}`
      )
      .addField(
        "**GENERAL:**",
        `autorole: ${
          autoRole !== null ? `${arole}` : "disabled"
        }\nsystem alerts: ${levelMsgs}\nuri blocker: ${uriBlocker}\ncase logging: ${caseLogging}\nprefix: ${prefix}`
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    return message.reply({ embeds: [emb] });
  }
};
