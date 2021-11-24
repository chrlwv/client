/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Unban extends Command {
  constructor() {
    super({
      name: "unban",
      aliases: [],
      description: "Unban a user from the current guild.",
      usage: "<user_id> <reason>",
      category:
        "<:charliewave_advanced_moderator:857930973715103775> Moderator",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["BAN_MEMBERS"],
      clientPerms: ["BAN_MEMBERS"],
    });
  }
  async exec(message, args, data) {
    let member = args[0];
    let reason = args.slice(1).join(" ");

    if (!member) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}unban <user_id> <reason>\``
      );
    }

    const guildSettings = await this.client.getGuildById(message.guild.id);

    if (!reason) reason = "no reason";

    const bannedUser = await message.guild.members.unban(member, reason);

    message.channel.send(
      `Successfully unbanned ${bannedUser.tag}, reason: ${reason}`
    );

    if (guildSettings.client_logging.enable === true) {
      await this.client.updateGuildById(member.guild.id, {
        "client_logging.case": guildSettings.client_logging.case + 1,
      });

      if (!guildSettings.client_logging.channel)
        return message.reply(
          `In case you forgot, use ${guildSettings.prefix}logchannel to set a channel for the logger.`
        );

      if (guildSettings.client_logging.channel) {
        if (
          !member.guild.channels.cache.find(
            (ch) => ch.id === guildSettings.client_logging.channel
          )
        )
          return;

        let emb;
        emb = embed()
          .setColor(0x36393e)
          .setTitle(
            `ACTION: \`UNBAN\` CASE: \`${guildSettings.client_logging.case}\``
          )
          .setDescription(
            `\`\`\`js\nUser: ${member.user.tag} (ID: ${member.user.id})\nModerator: ${message.author.tag} (${message.author.id})\nReason: ${reason}\n\`\`\``
          )
          .setThumbnail(member.displayAvatarURL)
          .setTimestamp();

        this.client.channels.cache
          .get(guildSettings.client_logging.channel)
          .send({ conent: "guildUnBanAdd", embeds: [emb] });
      }
    }
  }
};
