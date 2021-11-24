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

    if (guildSettings.modLogging.enable === true) {
      await this.client.updateGuildById(member.guild.id, {
        "modLogging.case": guildSettings.modLogging.case + 1,
      });

      if (guildSettings.modLogging.channel) {
        if (
          !member.guild.channels.cache.find(
            (ch) => ch.id === guildSettings.modLogging.channel
          )
        )
          return;

        let emb;
        emb = embed()
          .setColor(0x36393e)
          .setTitle(
            `ACTION: \`UNBAN\` CASE: \`${guildSettings.modLogging.case}\``
          )
          .setDescription(
            `\`\`\`js\nUser: ${member.user.tag} (ID: ${member.user.id})\nModerator: ${message.author.tag} (${message.author.id})\nReason: ${reason}\n\`\`\``
          )
          .setThumbnail(member.displayAvatarURL)
          .setTimestamp();

        this.client.channels.cache
          .get(guildSettings.modLogging.channel)
          .send({ conent: "guildUnBanAdd", embeds: [emb] });
      }
    }
  }
};
