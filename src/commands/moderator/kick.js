const {
  embed
} = require("../../utils/Utils");

module.exports = class Kick extends Command {
  constructor() {
    super({
      name: "kick",
      aliases: [],
      description: "Kick a user from the current guild.",
      usage: "<user> <reason>",
      category: "Moderator",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["KICK_MEMBERS"],
      clientPerms: ["KICK_MEMBERS"],
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

    let reason = args.slice(1).join(" ");

    if (!args.length) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}kick <user> <reason>\``
      );
    }

    if (!member) {
      return message.reply("This user is no longer on this guild.");
    }

    if (!reason) reason = "no reason";

    if (!member.kickable) {
      return message.reply("I am not able to ban this user.");
    }

    await message.guild.members.kick(member, {
      reason: reason
    });


    this.client.users.fetch(member.user.id, false).then((user) => {
      user.send(
        `You were kicked from \`${message.guild.name}\` guild by ${message.author.tag}, reason: ${reason}`
      );
    });

    message.reply(
      `${message.author.tag} kick ${member.user.tag}, reason: ${reason}`
    );

    if (guildSettings.client_logging.enable === true) {
      await this.client.updateGuildById(member.guild.id, {
        "client_logging.case": guildSettings.client_logging.case+1,
      });

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
            `ACTION: \`KICK\` CASE: \`${guildSettings.client_logging.case}\``
          )
          .setDescription(
            `\`\`\`js\nUser: ${member.user.tag} (ID: ${member.user.id})\nModerator: ${message.author.tag} (${message.author.id})\nReason: ${reason}\n\`\`\``
          )
          .setThumbnail(member.displayAvatarURL)
          .setTimestamp();

        this.client.channels.cache
          .get(guildSettings.client_logging.channel)
          .send({
            conent: "guildKickAdd",
            embeds: [emb]
          });
      }
    }
  }
};