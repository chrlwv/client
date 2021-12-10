/** @format */

const { embed } = require("../../utils/Utils");
const { MessageActionRow, MessageButton } = require("discord.js");

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

    const level_module = guild?.level_msg_module;
    const uri_module = guild?.uri_blocker_module;

    const welcome_module = guild?.welcome_event_module;
    const leave_module = guild?.leave_event_module;

    const auto_role_module = guild?.auto_role_module;
    const auto_role = message.guild.roles.cache.get(auto_role_module);

    const logger_channel = guild?.client_logging.enable;
    const case_logger = guild?.client_logging.enable;

    const btnGithub = new MessageButton()
      .setURL("https://github.com/charliewave-me/issues")
      .setLabel("Issues")
      .setStyle("LINK");

    const row = new MessageActionRow().addComponents(btnGithub);

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
          welcome_module !== null ? `<#${welcome_module}>` : "disabled"
        } \nleave channel: ${
          leave_module !== null ? `<#${leave_module}>` : "disabled"
        }`,
        true
      )
      .addField(
        "**SYSTEM:**",
        `level-up alerts: ${level_module}\nuri blocker: ${uri_module}`,
        true
      )
      .addField(
        "**GUILD:**",
        `autorole: ${
          auto_role_module !== null ? `${auto_role}` : "disabled"
        }\ncase logger: ${case_logger}\nlogger channel: ${logger_channel}`,
        true
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    return message.reply({ embeds: [emb], components: [row] });
  }
};
