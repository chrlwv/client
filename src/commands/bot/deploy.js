const {
  embed
} = require('../../utils/Utils');
const {
  MessageActionRow,
  MessageButton
} = require('discord.js');

module.exports = class Deployment extends Command {
  constructor() {
    super({
      name: 'deploy',
      aliases: ['deployment'],
      description: 'About chrlwv-client deploy.',
      usage: '',
      category: 'Core',
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
        `${this.client.user.tag}`
      )
      .setDescription(
        `server uptime: ${this.constructor.uptime()}\n\`\`\`js\nchrlwv-cluster\neu-central-1\nspecial-worker-6********5-d***j\n\`\`\`\n\`\`\`js\nMemoryPressure :: False\nDiskPressure :: False\nPIDPressure :: False\nReady :: True\n\`\`\``
      )
    return message.reply({
      embeds: [emb],
      components: [row]
    });
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