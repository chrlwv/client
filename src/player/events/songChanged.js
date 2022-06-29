module.exports = class SongChanged extends Event {
    constructor() {
        super({
            name: "songChanged",
            once: false,
        });
    }

    async exec(queue, newSong, oldSong) {
        let channel = queue.textChannel;
        queue.lastTrack = oldSong;
        if (channel) {
            queue.skipVotes = [];
            if (oldSong.name !== newSong.name) {
                if (oldSong) {
                    if (oldSong.playingMessage) {
                        if (oldSong.playingMessage.deletable) {
                            await oldSong.playingMessage.delete();
                        }
                    }
                    channel
                        .send(
                            `Started playing **${newSong.name}**`
                        )
                        .then((m) => {
                            newSong.playingMessage = m;
                        });

                } else {
                    channel
                        .send(
                            `Started playing **${newSong.name}**`
                        )
                        .then((m) => {
                            newSong.playingMessage = m;
                        });
                }
            }
        }
    }
};