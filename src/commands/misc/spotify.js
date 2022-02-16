/** @format */
const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = class Spotify extends Command {
  constructor() {
    super({
      name: 'spotify',
      aliases: [],
      description: "Fetch spotify content from the user's presence.",
      usage: '',
      category: '<:charliewave_general:771633361340727336> Misc',
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (m) =>
          m.displayName.toLowerCase().includes(args[0]) ||
          m.user.tag.toLowerCase().includes(args[0])
      ) ||
      message.member;

    if (!member) {
      return message.reply('No user found.');
    }

    if (!member.presence.activities)
      return message.reply('You are not listening to Spotify.');

    member.presence.activities.forEach((activity) => {
      if (!activity || activity.name !== 'Spotify') return;

      const card = new canvacord.Spotify()
        .setAuthor(activity.state.replace(/;/g, ','))
        .setAlbum(activity.assets.largeText)
        .setStartTimestamp(activity.timestamps.start)
        .setEndTimestamp(activity.timestamps.end)
        .setImage(activity.assets.largeImageURL())
        .setTitle(activity.details);

      card.build().then((buffer) => {
        const attachment = new MessageAttachment(buffer, 'spotify.png');

        return message.reply({ files: [attachment] });
      });
    });
  }
};
