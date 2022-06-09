/** @format */

const { embed, removeDuplicates, formatPerms } = require('../../utils/Utils');

module.exports = class Help extends Command {
  constructor() {
    super({
      name: 'help',
      aliases: ['?', 'commands'],
      description:
        'Generating help commands tab. (specify a command name for more informations for the selected item)',
      usage: '<command>',
      category: '<:charliewave_supporter:771641583963340821> Core',
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const cmd =
      this.client.commands.get(args[0]) ||
      this.client.commands.get(this.client.aliases.get(args[0]));
    let emb;
    if (!cmd) {
      emb = embed()
        .setColor(0x36393e)
        .setDescription(`Prefix: \`${data.guild?.prefix}\``)
        .setFooter({
          text: `To get info of each command type ${data.guild?.prefix}help [command]`
        })
        .setThumbnail(message.guild.iconURL({ dynamic: true }));
      const categories = removeDuplicates(
        this.client.commands.map((cmd) => cmd.category)
      );
      for (const category of categories) {
        await emb.addField(
          `**${category}**`,
          `${this.client.commands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``)
            .join(' ')}`
        );
      }
      return message.channel.send({ embeds: [emb] });
    } else {
      emb = embed()
        .setColor(0x36393e)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(
          [
            `**Aliases:** ${
              cmd.aliases.length
                ? cmd.aliases.map((alias) => `\`${alias}\``).join(' ')
                : `No aliases.`
            }`,
            `**Description:** ${cmd.description}`,
            `**Category:** ${cmd.category}`,
            `**Permission:** ${
              cmd.memberPerms.toArray().length > 0
                ? `${cmd.memberPerms
                    .toArray()
                    .map((perm) => `\`${formatPerms(perm)}\``)
                    .join(', ')}`
                : `No permission required.`
            }`,
            `**Cooldown:** ${cmd.cooldown / 1000} seconds`,
            `**Usage:** \`${`${data.guild?.prefix}${cmd.name} ${
              cmd.usage || ''
            }`.trim()}\``,
          ].join('\n')
        );
      return message.channel.send({ embeds: [emb] });
    }
  }
};
