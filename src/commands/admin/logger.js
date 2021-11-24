/** @format */

const guildsData = require("../../models/Guilds");

module.exports = class Logger extends Command {
  constructor() {
    super({
      name: "logger",
      aliases: ["caselogs", "logs", "caselogging"],
      description: "Enabled or disabled the case logger module.",
      usage: "<option> <channel>",
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
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}logger <enable / disable>\``
      );
    }

    switch (option.toLowerCase()) {
      case "enable":
        updateItem("modLogging.enable", true, guildId);
        message.reply(`Successfully enabled \`logger\` module.`);
        break;

      case "disable":
        updateItem("modLogging.enable", false, guildId);
        message.channel.send(`Disabled \`logger\` module.`);
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

async function updateItemDisable(type, guildId) {
  await updateGuildById(guildId, {
    [type]: null,
  });
}
