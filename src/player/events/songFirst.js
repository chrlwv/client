module.exports = class SongFirst extends Event {
    constructor() {
        super({
            name: "songFirst",
            once: false,
        });
    }

    async exec(queue, song) {
        let channel = queue.textChannel;
        queue.skipVotes = [];
        if (channel) {
            channel
                .send(`Started playing **${song.name}**`)
                .then((m) => {
                    song.playingMessage = m;
                });
        }
    }
};