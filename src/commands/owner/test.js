/** @format */

module.exports = class LocaleTest extends Command {
  constructor() {
    super({
      name: 'locale',
      aliases: [],
      description: 'Locale command',
      usage: '',
      category: '<:charliewave_ownership:771637500967124994> Owner',
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
    message.reply(this.client.getGuildLang.OWNER.TEST);
  }
};
