/** @format */

const guildsData = require("../../models/Guilds");

module.exports = class LeaveChannel extends Command {
  constructor() {
    super({
      name: "leavechannel",
      aliases: ["leftchannel"],
      description: "Enabled or disabled the goodbye module.",
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
    const item = message.mentions.channels.first();
    const guildId = message.guild.id;

    if (!option) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}leavechannel <option> <channel>\``
      );
    }

    switch (option.toLowerCase()) {
      case "enable":
        if (!item) {
          return message.reply("Make sure you mention a channel.");
        }

        updateItem("leave_event_module", item, guildId);
        message.reply(
          `Successfully enabled \`goodbye\` module, channel: ${item}.`
        );
        break;

      case "disable":
        updateItem("leave_event_module", false, guildId);
        message.channel.send(`Successfully disabled the \`goodbye\` module.`);
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
