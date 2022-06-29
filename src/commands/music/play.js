module.exports = class Play extends Command {
    constructor() {
        super({
            name: "play",
            aliases: ["p"],
            description: "Adds a song to the queue.",
            usage: "<song name / spotify, appleMusic or youtube playlist link>",
            category: "Music",
            ownerOnly: false,
            cooldown: 3000,
        });
    }
    async exec(message, args, data) {
        try {
            const song = args.join(" ").slice(0);
            let channel = message.member.voice.channel;
            if (!song)
                return message.reply(`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}play <song name / spotify, appleMusic or youtube playlist link>\``);
            if (!channel)
                return message.reply('You must be in a voice channel to use this command!')
            if (message.guild.me.voice.channel && channel !== message.guild.me.voice.channel)
                return message.reply('You must be in the same voice channel as me to use this command!');

            const spotifyTrackRegex =
                /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/track\/)(.*)$/;
            const spotifyPlaylistRegex =
                /^(https?:\/\/)?(www\.)?(open\.spotify\.com)\/playlist\/(.*)$/;
            const spotifyAlbumRegex =
                /^(?:https?:\/\/)?open\.spotify\.com\/album\/([a-zA-Z0-9]{22})(?:\S+)?/;
            const appleMusicPlaylistRegex =
                /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/playlists\/(.*)$/;
            const appleMusicAlbumRegex =
                /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/album\/(.*)$/;
            const appleMusicTrackRegex =
                /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/(.*)\/(.*)$/;
            const youtubePlaylistRegex =
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/playlist\?list=(.*)$/;
            const youtubeVideoRegex =
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch\?v=(.*)$/;
            const youtubeMusicAlbumRegex =
                /^(https?:\/\/)?(music\.youtube\.com)\/playlist\?list=(.*)$/;
            const youtubeMusicTrackRegex =
                /^(https?:\/\/)?(music\.youtube\.com)\/watch\?v=(.*)$/;

            const isPlaylist =
                youtubePlaylistRegex.test(song) ||
                youtubeMusicAlbumRegex.test(song) ||
                spotifyPlaylistRegex.test(song) ||
                spotifyAlbumRegex.test(song) ||
                appleMusicPlaylistRegex.test(song) ||
                appleMusicAlbumRegex.test(song);

            let source;
            if (
                spotifyTrackRegex.test(song) ||
                spotifyAlbumRegex.test(song) ||
                spotifyPlaylistRegex.test(song)
            ) {
                source = "spotify";
            } else if (
                appleMusicTrackRegex.test(song) ||
                appleMusicAlbumRegex.test(song) ||
                appleMusicPlaylistRegex.test(song)
            ) {
                source = "apple-music";
            } else if (
                youtubeVideoRegex.test(song) ||
                youtubePlaylistRegex.test(song)
            ) {
                source = "youtube";
            } else if (
                youtubeMusicTrackRegex.test(song) ||
                youtubeMusicAlbumRegex.test(song)
            ) {
                source = "youtube-music";
            } else {
                source = "youtube";
            }

            if (isPlaylist) {
                return this.client.play(
                    this.client,
                    message,
                    data,
                    song,
                    source,
                    true,
                    false,
                    false,
                    false
                );
            } else {
                return this.client.play(
                    this.client,
                    message,
                    data,
                    song,
                    source,
                    false,
                    false,
                    false
                );
            }
        } catch (e) {
            this.client.logger.log
            `${e.message}`, {
              tag: "musicPlugin"
            }
        }
    }
};