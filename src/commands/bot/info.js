const {
  embed
} = require('../../utils/Utils');
const {
  MessageActionRow,
  MessageButton
} = require('discord.js');

module.exports = class Informations extends Command {
  constructor() {
    super({
      name: 'info',
      aliases: ['bot', 'botinfo', 'aboutbot'],
      description: 'About Charliewave Discord application.',
      usage: '',
      category: 'Core',
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    if (args.join(' ')) {
      message.react('😄');
    }

    const buttonGithub = new MessageButton()
      .setURL('https://github.com/chrlwv')
      .setLabel('GitHub')
      .setStyle('LINK');

    const buttonSupport = new MessageButton()
      .setURL('https://discord.gg/RPRfpnM6MZ')
      .setLabel('Support')
      .setStyle('LINK');

    const buttonWebsite = new MessageButton()
      .setURL('https://chrlwv.tech')
      .setLabel('Website')
      .setStyle('LINK');

    const row = new MessageActionRow().addComponents(
      buttonGithub,
      buttonSupport,
      buttonWebsite
    );

    let emb;
    emb = embed()
      .setColor(0x36393e)
      .setTitle(
        `${this.client.user.tag}`
      )
      .setDescription(
        `${this.client.user.username} is an experienced multipurpose bot that has a ton of features you will enjoy using.\n\nBy using \`${data.guild?.prefix}help\` you can learn how to interact with <@${this.client.user.id}> and make sure you understand the chrlwv-verse better!`
      )
      .setThumbnail(
        this.client.user.avatarURL({
          dynamic: true,
          size: 2048,
          format: 'png'
        })
      );
    return message.reply({
      embeds: [emb],
      components: [row]
    });
  }
};