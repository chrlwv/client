/** @format */

const { embed } = require('../../utils/Utils');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class Deployment extends Command {
  constructor() {
    super({
      name: 'deploy',
      aliases: ['deployment', 'porter', 'aws'],
      description: 'About client\'s porter deploy.',
      usage: '',
      category: '<:charliewave_supporter:771641583963340821> Core',
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {

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
        `${this.client.user.tag} ${this.constructor.getTargetEmojiByStatus(
          this.client.presence.status,
          this.client.presence.clientStatus != undefined &&
            this.client.presence.clientStatus.mobile
        )}`
      )
      .setDescription(
        `server uptime: ${this.constructor.uptime()}\n[porter.dev](https://getporter.dev)\n\`\`\`js\nchrlwv-cluster\nip-10-99-1-177.eu-central-1.compute.internal\nspecial-worker-6d85d48f55-dbg2j\n\`\`\`\n\`\`\`js\nMemoryPressure :: False\nDiskPressure :: False\nPIDPressure :: False\nReady :: True\n\`\`\``
      )
      .setThumbnail('https://getporter.dev/ptr.png');
    return message.reply({ embeds: [emb], components: [row] });
  }

  static getTargetEmojiByStatus(status, mobile) {
    switch (status) {
      case 'dnd':
        return '<:charliewave_dnd:771635335486111744>';
      case 'idle':
        return '<:charliewave_idle:771635289839501333>';
      case 'online':
        return mobile === 'online'
          ? '<:charliewave_mobile:771635443698499584>'
          : '<:charliewave_online:771635233384693791>';
      }
      
    }
    
    static uptime() {
    var msec = process.uptime().toFixed(0) * 1000;
    var days = Math.floor(msec / 1000 / 60 / 60 / 24);
    msec -= days * 1000 * 60 * 60 * 24;
    var hours = Math.floor(msec / 1000 / 60 / 60);
    msec -= hours * 1000 * 60 * 60;
    var mins = Math.floor(msec / 1000 / 60);
    msec -= mins * 1000 * 60;
    var secs = Math.floor(msec / 1000);
    var timestr = '';
    if (days > 0) {
      timestr += days + 'd ';
    }
    if (hours > 0) {
      timestr += hours + 'h ';
    }
    if (mins > 0) {
      timestr += mins + 'm ';
    }
    if (secs > 0) {
      timestr += secs + 's';
    }
    return timestr;
  }
};
