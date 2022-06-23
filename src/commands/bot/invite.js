const {
  embed
} = require('../../utils/Utils');
const {
  MessageActionRow,
  MessageButton
} = require('discord.js');

module.exports = class Invite extends Command {
  constructor() {
    super({
      name: 'invite',
      aliases: ['invitebot', 'botinvite', 'inv'],
      description: 'Get the invite link for Charliewave.',
      usage: '',
      category: 'Core',
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
    let inviteLink = `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=1916267615&scope=bot`;

    const buttonInvite = new MessageButton()
      .setURL(inviteLink)
      .setLabel('Invite')
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
      buttonInvite,
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
        `Click on the bottom \`Invite button\` to invite ${this.client.user.username} on your own server.`
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