/** @format */

const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = class Uptime extends Command {
  constructor() {
    super({
      name: 'uptime',
      aliases: ['uptime'],
      description: 'Displays bot uptime.',
      usage: '',
      category: '<:charliewave_supporter:771641583963340821> Core',
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
    const buttonSupport = new MessageButton()
      .setURL('https://discord.gg/RPRfpnM6MZ')
      .setLabel('Support')
      .setStyle('LINK');

    const row = new MessageActionRow().addComponents(buttonSupport);

    return message.reply({
      components: [row],
      ephemeral: true,
      content: [
        `client uptime: ${this.constructor.uptime()}`,
        `client status: <:charliewave_online:771635233384693791> online.`,
      ].join('\n'),
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
