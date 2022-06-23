const guildsData = require("../../models/Guilds");

module.exports = class UriBlocker extends Command {
  constructor() {
    super({
      name: "uriblocker",
      aliases: ["urlblocker", "antilink", "blocklink"],
      description: "Enabled or disabled the uri blocker module.",
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

    if (!args[0]) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}uriblocker <enable / disable>\``
      );
    }

    switch (option.toLowerCase()) {
      case "enable":
        updateItem("uri_blocker_module", true, guildId);
        message.channel.send(
          `Successfully enabled \`uri blocker\` monitor for this guild.`
        );
        break;

      case "disable":
        updateItem("uri_blocker_module", false, guildId);
        message.channel.send(`Disabled \`uri blocker\` monitor for now.`);
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