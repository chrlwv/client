const guildsData = require("../../models/Guilds");

module.exports = class LogChannel extends Command {
  constructor() {
    super({
      name: "logchannel",
      aliases: ["modlog"],
      description: "Provide the case log channel.",
      usage: "<channel>",
      category: "Admin",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_GUILD"],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const item = message.mentions.channels.first();
    const guildId = message.guild.id;

    if (!item) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}logchannel <channel>\``
      );
    }

    updateItem("client_logging.channel", item, guildId);
    message.reply(`Successfully changed \`log channel\`, channel: ${item}.`);
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