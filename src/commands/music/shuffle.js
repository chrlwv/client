module.exports = class Shuffle extends Command {
    constructor() {
        super({
            name: "shuffle",
            aliases: [],
            description: "Shuffles the queue.",
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
                !message.member.permissions.has("MANAGE_GUILD")
            ) {
                return message.reply('You must have \`MANAGE_GUILD\` permission or be alone in the voice channel to use this command!');
            }

            let queue = this.client.player.getQueue(message.guild.id);
            if (!queue)
                return message.reply('There is no music playing in this guild!');

            queue.shuffle();

            return message.reply('Shuffled the queue!');
        } catch (e) {
            this.client.logger.log `${e.message}`, {
                tag: "musicPlugin"
            }
        }
    }
};