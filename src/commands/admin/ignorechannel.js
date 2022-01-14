/** @format */
const guildsData = require("../../models/Guilds");

module.exports = class IgnoreChannel extends Command {
  constructor() {
    super({
      name: "ignorechannel",
      aliases: ["ignorech", "ignorec", "ignoredchannels"],
      description: "Add or remove a channel from the ignore channel list.",
      usage: "<option> <channel>",
      category: "<:charliewave_settings:771462923855069204> Admin",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_GUILD"],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const guildId = message.guild.id;
    const option = args[0];
    const item = message.mentions.channels.first() || message.channel;
    const guild = await this.client.getGuildById(guildId);
    const ignored_channels_const = guild?.ignored_channels;

    if (!option) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}ignorechannel <add / remove> <!channel>\``
      );
    }

    if (!item) {
      return message.reply("Make sure you mention the channel.");
    }

    switch (option.toLowerCase()) {
      case "add":
        if (ignored_channels_const.includes(item.id)) {
          return message.reply("This channel is already ignored.");
        }

        await updateGuildById(guildId, {
          ignored_channels: [...ignored_channels_const, item.id],
        });

        message.reply(
          `Successfully added to \`ignored channels\`, channel: ${item}.`
        );
        break;
      case "remove":
        if (!ignored_channels_const.includes(item.id)) {
          return message.reply("This channel is not ignored.");
        }

        await updateGuildById(guildId, {
          ignored_channels: ignored_channels_const.filter(
            (ci) => ci !== item.id
          ),
        });

        return message.reply(
          `Successfully removed from \`ignored channels\`, channel: ${item}`
        );
      default:
        return message.reply(`${option} is not a valid option.`);
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
