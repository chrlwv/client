const {
  embed
} = require('../../utils/Utils');
const {
  MessageActionRow,
  MessageButton,
  version: discordVersion,
} = require('discord.js');
const {
  stripIndents
} = require('common-tags');

module.exports = class Process extends Command {
  constructor() {
    super({
      name: 'process',
      aliases: ['stats', 'status'],
      description: 'Displays bot stats.',
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
      .addField(
        '<:system:989572478017884190> **SYSTEM:**',
        stripIndents `**Memory:**: ${this.constructor.formatBytes(
          process.memoryUsage().heapUsed,
          2
        )}\n\
                **Discord.js:** v${discordVersion}\n\
                **Server:** chrlwv-cluster\n\
				**Developer:** skillzl#7600`,
        true
      )
      .addField(
        '<:intents:989572418228064317> **INTENTS:**',
        stripIndents `**Users:**: ${this.client.users.cache.size.toLocaleString()}\n\
                **Guilds:** ${this.client.guilds.cache.size.toLocaleString()}\n\
                **Channels:** ${this.client.channels.cache.size.toLocaleString()}\n\
            **Commands:** ${this.client.commands.size.toLocaleString()}`,
        true
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

  static formatBytes(a, b) {
    if (0 == a) return '0 Bytes';
    var c = 1024,
      d = b || 2,
      e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
  }
};