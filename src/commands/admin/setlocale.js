/** @format */

module.exports = class SetLocale extends Command {
  constructor() {
    super({
      name: 'setlocale',
      aliases: ['setlang', 'lang'],
      description: 'Manage the i18n system. (multilingual)',
      usage: '<locale>',
      category: '<:charliewave_settings:771462923855069204> Admin',
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: ['MANAGE_GUILD'],
      clientPerms: [],
    });
  }
  async exec(message, args) {
    const languages = this.client.getLanguages();
    const language = args[0];

    if (!language) {
      return message.reply('Only `english` language is available for now.');
    }

    if (!languages.includes(language)) {
      return message.reply('This language is not available yet.');
    }

    updateItem('locale', language, message.guild.id);
    message.reply(`Successfully changed the \`language\` to ${language}.`);

    async function updateItem(type, item, guildId) {
      await updateGuildById(guildId, {
        [type]: item,
      });
    }
  }
};
