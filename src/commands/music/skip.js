module.exports = class Skip extends Command {
    constructor() {
        super({
            name: "skip",
            aliases: ["st"],
            description: "Skips the current track.",
            usage: "",
            category: "Music",
            ownerOnly: false,
            cooldown: 3000,
        });
    }
    async exec(message) {
        try {
            let channel = message.member.voice.channel;
            if (!channel)
                return message.reply('You must be in a voice channel to use this command!');
            if (message.guild.me.voice.channel && channel !== message.guild.me.voice.channel)
                return message.reply('You must be in the same voice channel as me to use this command!');

            let queue = this.client.player.getQueue(message.guild.id);
            if (!queue || !queue.nowPlaying)
                return message.reply('There is no music playing in this guild!');

            let members = channel.members.filter((m) => !m.user.bot);

            if (members.size > 1 && !message.member.permissions.has("MANAGE_GUILD")) {
                let required = members.size === 2 ? 2 : Math.ceil(members.size / 2);

                if (queue.skipVotes.includes(message.user.id)) {
                    return int.reply('You\'ve already voted to skip the current track!');
                }

                queue.skipVotes.push(message.user.id);
                message.reply(`You voted to skip the current track! **${queue.skipVotes.length}/${required}**`);

                if (queue.skipVotes.length >= required) {
                    queue.skipVotes = [];
                    let skipped = queue.skip();

                    message.channel.send(
                        `Skipped **${skipped.name}**!`
                    );
                }
            } else {
                queue.skipVotes = [];
                let skipped = queue.skip();

                message.reply(`Skipped **${
            skipped.name
          }**!`);
            }
        } catch (e) {
            this.client.logger.log `${e.message}`, {
                tag: "musicPlugin"
            }
        }
    }
};