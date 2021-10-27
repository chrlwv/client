/** @format */

const guildsData = require("../../models/Guilds");

module.exports = class SystemAlerts extends Command {
  constructor() {
    super({
      name: "systemalerts",
      aliases: ["sysalerts", "alerts"],
      description: "Enabled or disabled system alerts.",
      usage: "<option>",
      category: "<:charliewave_settings:771462923855069204> Admin",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_GUILD"],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const option = args[0];
    const guildId = message.guild.id;

    if (!option) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}systemalerts <option>\``
      );
    }

    switch (option.toLowerCase()) {
      case "enable":
        updateItem("level_msg_module", true, guildId);
        message.reply(`Successfully enabled \`system alerts\` helper.`);
        break;

      case "disable":
        updateItem("level_msg_module", false, guildId);
        message.channel.send(
          `Successfully disabled the \`system alerts\` helper.`
        );
    }
  }
};

async function updateGuildById(guildId, settings) {
  if (typeof settings !== "object") {
    throw Error("'settings' must be an object");
  }

  const guild = await getGuildById(guildId);

  if (!guild) {
    await this.client.addGuild(guildId);
  }

  await guildsData.findOneAndUpdate({ guildId: guildId }, settings);
}

async function getGuildById(guildId) {
  let guild = await guildsData.findOne({ guildId: guildId });

  if (!guild) {
    guild = await this.client.addGuild(guildId);
  }
  return guild;
}
async function updateItem(type, item, guildId) {
  await updateGuildById(guildId, {
    [type]: item,
  });
}
