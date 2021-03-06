module.exports = class Pause extends Command {
    constructor() {
        super({
            name: "pause",
            aliases: [],
            description: "Alternates the pause state of the music player.",
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

            let members = channel.members.filter((m) => !m.user.bot);

            if (
                members.size > 1 &&
                !message.member.permissions.has("MANAGE_GUILD") &&
                !this.client.owners.includes(message.author.id)
            ) {
                return message.reply('You must have \`MANAGE_GUILD\` permission or be alone in the voice channel to use this command!');
            }

            let hasQueue = this.client.player.hasQueue(message.guild.id);
            if (!hasQueue)
                return message.reply('There is no music playing in this guild!');

            let queue = this.client.player.getQueue(message.guild.id);

            if (queue.paused) {
                queue.setPaused(false);

                return message.reply('Resumed the music player!');
            } else {
                queue.setPaused(true);
                return message.reply('Paused the music player!');
            }
        } catch (e) {
            this.client.logger.log `${e.message}`, {
                tag: "musicPlugin"
            }
        }
    }
};