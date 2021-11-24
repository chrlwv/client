/** @format */

const guildsData = require("../../models/Guilds");

module.exports = class Autorole extends Command {
  constructor() {
    super({
      name: "autorole",
      aliases: ["arole", "newcomer", "newbie"],
      description: "Enabled or disabled the auto role module.",
      usage: "<option> <role>",
      category: "<:charliewave_settings:771462923855069204> Admin",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_GUILD"],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const option = args[0];
    const item = message.mentions.roles.first();
    const guildId = message.guild.id;

    if (!option) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}autorole <enable / disable> <role>\``
      );
    }

    switch (option.toLowerCase()) {
      case "enable":
        if (!item) {
          return message.reply("Make sure you assign a server role.");
        }

        updateItem("auto_role_module", item, guildId);
        message.reply(`Successfully updated \`newcomer\` role, role: ${item}.`);
        break;

      case "disable":
        updateItem("auto_role_module", false, guildId);
        message.channel.send(`Disabled \`newcomer\` module.`);
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
