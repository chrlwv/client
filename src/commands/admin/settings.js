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
      .setLabel("Info")
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
          welcome_module !== null
            ? `<a:toggle_on:913075299871248485> <#${welcome_module}>`
            : "<a:toggle_off:913075299359551539>"
        } \nleave channel: ${
          leave_module !== null
            ? `<a:toggle_on:913075299871248485> <#${leave_module}>`
            : "<a:toggle_off:913075299359551539>"
        }`,
        true
      )
      .addField(
        "**SYSTEM:**",
        `level-up alerts: ${
          level_module !== null
            ? `<a:toggle_on:913075299871248485>`
            : `<a:toggle_off:913075299359551539>`
        }\nuri blocker: ${
          uri_module !== null
            ? `<a:toggle_on:913075299871248485>`
            : `<a:toggle_off:913075299359551539>`
        }`,
        true
      )
      .addField(
        "**GUILD:**",
        `autorole: ${
          auto_role_module !== null
            ? `<a:toggle_on:913075299871248485> ${auto_role}`
            : "<a:toggle_off:913075299359551539>"
        }\ncase logger: ${
          case_logger !== null
            ? `<a:toggle_on:913075299871248485>`
            : "<a:toggle_off:913075299359551539>"
        } ${
          logger_channel !== null
            ? `<#${logger_channel}>`
            : `no channel established`
        }`,
        true
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    return message.reply({ embeds: [emb], components: [row] });
  }
};
