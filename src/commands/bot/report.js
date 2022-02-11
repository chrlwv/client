/** @format */

const ms = require('ms');
const { WebhookClient } = require('discord.js');

const { embed } = require('../../utils/Utils');

module.exports = class Report extends Command {
  constructor() {
    super({
      name: 'report',
      aliases: ['bug', 'bugreport'],
      description: 'Gives you a chance to report bugs.',
      usage: '<user>',
      category: '<:charliewave_supporter:771641583963340821> Core',
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const timeout = 1800000;
    const { user } = await this.client.getUserById(message.author.id);
    const report = user.report_cooldown;
    const bug = args.join(' ');

    if (!bug) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}report <your_discover>\``
      );
    }

    if (report !== null && timeout - (Date.now() - report) > 0) {
      let time = ms(timeout - (Date.now() - report), { long: true });

      message.reply(
        `You've already used the report command recently, \`${time}\` remaining.`
      );
    } else {
      const webhookClient = new WebhookClient({
        id: '900345596131565568',
        token:
          'hTHmf_hJJPE6iaATkrfLGUVOgcvqMqa3T2jJzr76xFyvJzxyMtrzBEGO0HfJ1rznKdgb',
      });

      let emb;
      emb = embed()
        .setColor(0x36393e)
        .addField(`Author:`, message.author.tag)
        .addField(`Bug Description:`, bug)
        .setThumbnail('https://www.charliewave.me/favicon.ico');

      webhookClient.send({
        username: 'chàrlie',
        avatarURL: 'https://www.charliewave.me/favicon.ico',
        embeds: [emb],
      });

      this.client.updateUserById(message.author.id, {
        report_cooldown: Date.now(),
      });

      message.reply(`Successfully sent the report. Thanks for your feedback!`);
    }
  }
};
