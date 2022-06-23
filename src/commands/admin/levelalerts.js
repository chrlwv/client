const guildsData = require("../../models/Guilds");

module.exports = class LevelUpAlerts extends Command {
  constructor() {
    super({
      name: "levelalerts",
      aliases: ["lvlalerts", "lvlalert"],
      description: "Enabled or disabled the level-up alerts.",
      usage: "<option>",
      category: "Admin",
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
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}levelalerts <enable / disable>\``
      );
    }

    switch (option.toLowerCase()) {
      case "enable":
        updateItem("level_msg_module", true, guildId);
        message.reply(
          `Successfully enabled \`level-up alerts\ for this guild.`
        );
        break;

      case "disable":
        updateItem("level_msg_module", false, guildId);
        message.channel.send(`Disabled \`level-up alerts\` for this guild.`);
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

  await guildsData.findOneAndUpdate({
    guildId: guildId
  }, settings);
}

async function getGuildById(guildId) {
  let guild = await guildsData.findOne({
    guildId: guildId
  });

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