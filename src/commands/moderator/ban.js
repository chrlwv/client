const {
  embed
} = require("../../utils/Utils");

module.exports = class Ban extends Command {
  constructor() {
    super({
      name: "ban",
      aliases: ["tempban"],
      description: "Ban a user from the current guild.",
      usage: "<user> <days> <reason>",
      category: "Moderator",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["BAN_MEMBERS"],
      clientPerms: ["BAN_MEMBERS"],
    });
  }
  async exec(message, args, data) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (m) =>
        m.displayName.toLowerCase().includes(args[0]) ||
        m.user.tag.toLowerCase().includes(args[0])
      );

    const guildSettings = await this.client.getGuildById(message.guild.id);

    let reason = args.slice(2).join(" ");
    let days = args[1];

    if (!args.length) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}ban <user> <days> <reason>\``
      );
    }

    if (days > 7) {
      return message.reply("Sorry, but the maximum number of days is 7.");
    }

    if (!member) {
      return message.reply("This user is no longer on this guild.");
    }

    if (!reason) reason = "no reason";
    if (!days) days = 7;

    await message.guild.members.ban(member, {
      days: days,
      reason: reason
    });

    this.client.users.fetch(member.user.id, false).then((user) => {
      user.send(
        `You were banned from \`${message.guild.name}\` guild by ${message.author.tag} for ${days} days, reason: ${reason}`
      );
    });

    message.reply(
      `${message.author.tag} banned ${member.user.tag} for ${days} days, reason: ${reason}`
    );

    if (guildSettings.client_logging.enable === true) {
      await this.client.updateGuildById(message.guild.id, {
        "client_logging.case": guildSettings.client_logging.case+1,
      });

      if (guildSettings.client_logging.channel) {
        if (
          !message.guild.channels.cache.find(
            (ch) => ch.id === guildSettings.client_logging.channel
          )
        )
          return;

        let emb;
        emb = embed()
          .setColor(0x36393e)
          .setTitle(
            `ACTION: \`BAN\` CASE: \`${guildSettings.client_logging.case}\``
          )
          .setDescription(
            `\`\`\`js\nUser: ${member.user.tag} (ID: ${member.user.id})\nModerator: ${message.author.tag} (${message.author.id})\nReason: ${reason}\n\`\`\``
          )
          .setThumbnail(member.displayAvatarURL)
          .setTimestamp();

        this.client.channels.cache
          .get(guildSettings.client_logging.channel)
          .send({
            conent: "guildUnBanAdd",
            embeds: [emb]
          });
      }
    }
  }
};