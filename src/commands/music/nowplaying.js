const sf = require("seconds-formater");
const {
    progressBar
} = require("../../player/functions/progress-bar");
const {
    msToSeconds
} = require("../../utils/Utils");
const {
    embed
} = require("../../utils/Utils");

module.exports = class NowPlaying extends Command {
    constructor() {
        super({
            name: "nowplaying",
            aliases: ["np"],
            description: "Displays the current playing track.",
            usage: "",
            category: "Music",
            ownerOnly: false,
            cooldown: 3000,
        });
    }
    async exec(message) {
        let channel = message.member.voice.channel;

        if (!channel)
            return message.reply('You must be in a voice channel to use this command!');
        if (message.guild.me.voice.channel && channel !== message.guild.me.voice.channel)
            return message.reply('You must be in the same voice channel as me to use this command!');

        let hasQueue = this.client.player.hasQueue(message.guild.id);
        if (!hasQueue) {
            return message.reply('There is no music playing in this guild!');
        }

        let queue = this.client.player.getQueue(message.guild.id);

        let song = queue.nowPlaying;
        if (!song) {
            return message.reply('There is no music playing in this guild!');
        }

        let total = song.milliseconds;
        let stream = queue.connection.player._state.resource.playbackDuration;

        let seconds = msToSeconds(stream);
        let time;
        if (seconds === 86400) {
            time = sf.convert(seconds).format("D day");
        } else if (seconds >= 3600) {
            time = sf.convert(seconds).format("H:MM:SS");
        } else {
            time = sf.convert(seconds).format("M:SS");
        }

        let emb;
        emb = embed()
            .setColor(0x36393e)
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setDescription(
                `${progressBar(
              total,
              stream,
              18,
              "▬",
              "<:line:991742245579522109>",
              "<:slider:991742244279308318>"
            )} ${time}/${song.duration}`
            );

        return message.reply({
            embeds: [emb]
        });
    }
};