const ms = require("ms");

module.exports = class Blacklist extends Command {
  constructor() {
    super({
      name: 'blacklist',
      aliases: ['block', 'white', 'whitelist'],
      description: 'Blocklist command',
      usage: '<user> <type: view; add; remove> <reason>',
      category: 'Owner',
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
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

    let reason = args.slice(2).join(" ");
    let type = args[1];

    if (!reason) reason = "no reason";

    if (!type) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}blacklist <user> <type: view; add; remove> <reason>\``
      );
    }

    if (member.id === this.client.user.id) {
      return message.reply("You cannot block the client itself.");
    }

    if (this.client.owners.includes(member.id)) {
      return message.reply("You cannot block the owner of this client.");
    }

    const users = await this.client.blacklistedData.find();

    switch (type) {
      case "view": {
        const usr = users.find((u) => u.userId === member.id);
        let blockedData = await this.client.blacklistedData.findOne({
          userId: member.id,
        });

        if (!usr) {
          return message.reply("This user is not blacklisted.");
        }

        let blockTime = ms(Date.now() - blockedData.date, {
          long: true
        });

        return message.reply(
          `${member.user.tag} has been blacklisted ${blockTime} ago, reason: ${blockedData.reason}.`
        );
      }
      case "add": {
        const existing = users.filter((u) => u.userId === member.id)[0];
        if (existing) {
          return message.reply(`${member.tag} is already blacklisted.`);
        }

        const blUser = new this.client.blacklistedData({
          userName: member.user.username,
          userDiscriminator: member.user.discriminator,
          userId: member.id,
          reason: reason,
        });

        await blUser.save();
        break;
      }
      case "remove": {
        if (users === null) {
          return message.reply("There are no users to whitelist.");
        }
        const exists = users.find((u) => u.userId === member.id);
        if (!exists) {
          return message.channel.send("This user is not blaclisted.");
        }

        await this.client.blacklistedData.findOneAndDelete({
          userId: member.id,
        });
        break;
      }
      default: {
        return message.reply(`\`${type}\` is not a valid type.`);
      }
    }
    return message.reply(
      `${message.author.tag} ${type === "add" ? "blocked" : "unblocked"} ${
        member.user.tag
      } from using ${this.client.user.tag}, reason: ${reason}`
    );
  }
};