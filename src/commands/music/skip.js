module.exports = class Skip extends Command {
    constructor() {
        super({
            name: "skip",
            aliases: ["s"],
            description: "Skips the current track.",
            usage: "",
            category: "Music",
            ownerOnly: false,
            cooldown: 3000,
        });
    }
    async exec(message, args) {
        let channel = message.member.voice.channel;
        let number = args[0];
        if (!channel)
            return message.reply('You must be in a voice channel to use this command!');
        if (message.guild.me.voice.channel && channel !== message.guild.me.voice.channel)
            return message.reply('You must be in the same voice channel as me to use this command!');

        let queue = this.client.player.getQueue(message.guild.id);
        if (!queue || !queue.nowPlaying)
            return message.reply('There is no music playing in this guild!');

        let members = channel.members.filter((m) => !m.user.bot);

        if (members.size > 1 && !message.member.permissions.has("MANAGE_GUILD") && !this.client.owners.includes(message.author.id)) {
            let required = members.size === 2 ? 2 : Math.ceil(members.size / 2);

            if (queue.skipVotes.includes(message.author.id)) {
                return message.reply('You\'ve already voted to skip the current track!');
            }

            queue.skipVotes.push(message.author.id);
            message.reply(`You voted to skip the current track! **${queue.skipVotes.length}/${required}**`);

            if (!number && queue.skipVotes.length >= required) {
                queue.skipVotes = [];
                let skipped = queue.skip();

                message.channel.send(
                    `Skipped **${skipped.name}**!`
                );
            }

        } else if (number) {
            let queue = this.client.player.getQueue(message.guild.id);
            if (!queue)
                return message.reply('There is no music playing in this guild!');

            if (number > queue.songs.length || number < 0)
                return message.reply('Invalid song number!');

            let song;
            queue.songs.forEach((s, m) => {
                if (m === number) {
                    song = s;
                }
            });

            await queue.skip(number - 1);
            return message.reply(`Skipped to **${number}.**`);
        } else {
            queue.skipVotes = [];
            let skipped = queue.skip();

            message.reply(`Skipped **${
            skipped.name
          }**!`);
        }
    }
};