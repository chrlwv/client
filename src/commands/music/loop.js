const { RepeatMode } = require("discord-music-player");

module.exports = class Loop extends Command {
    constructor() {
        super({
            name: "loop",
            aliases: [],
            description: "Changes the loop mode.",
            usage: "<mode>",
            category: "Music",
            ownerOnly: false,
            cooldown: 3000,
        });
    }
    async exec(message, args, data) {
        const mode = args.join(" ").slice(0);
        let channel = message.member.voice.channel;

        if (!mode) return message.reply(
            `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}loop <track or queue or disable>\``
        );

        if (!channel)
            return message.reply('You must be in a voice channel to use this command!');

        if (message.guild.me.voice.channel && channel !== message.guild.me.voice.channel)
            return message.reply('You must be in the same voice channel as me to use this command!');

        let members = channel.members.filter((m) => !m.user.bot);

        if (members.size > 1 && !message.member.permissions.has("MANAGE_GUILD")) {
            return message.reply('You must have \`MANAGE_GUILD\` permission or be alone in the voice channel to use this command!');
        }

        let hasQueue = this.client.player.hasQueue(message.guild.id);
        if (!hasQueue) {
            return message.reply('There is no music playing in this guild!');
        }

        let queue = this.client.player.getQueue(message.guild.id);

        if (mode === "track") {
            if (queue.repeatMode === RepeatMode.SONG) {
                return message.reply('The current loop mode is already set to `track`!');
            } else {
                queue.setRepeatMode(RepeatMode.SONG);
                return message.reply('The loop mode has been set to `track`!');
            }
        } else if (mode === "queue") {
            if (queue.repeatMode === RepeatMode.QUEUE) {
                return message.reply('The current loop mode is already set to `queue`!');
            } else {
                queue.setRepeatMode(RepeatMode.QUEUE);
                return message.reply('The loop mode has been set to `queue`!');
            }
        } else if (mode === "disable") {
            if (queue.repeatMode === RepeatMode.DISABLED) {
                return message.reply('The current loop mode is already set to `disable`!');
            } else {
                queue.setRepeatMode(RepeatMode.DISABLED);
                return message.reply('The loop mode has been set to `disable`!');
            }
        }
    }
};