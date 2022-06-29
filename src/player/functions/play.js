module.exports = async function play(
    client,
    message,
    data,
    input,
    source = "youtube",
    playlist = false,
    search = false,
    last = false,
) {

    let guildQueue = client.player.hasQueue(message.guild.id);
    let queue;

    if (!guildQueue) {
        queue = client.player.createQueue(message.guild.id);
        queue.skipVotes = [];
    } else {
        queue = client.player.getQueue(message.guild.id);
    }

    let channel = message.member.voice.channel;

    await queue.join(channel).catch((err) => {
        if (search) {
            return message.edit(`I couldn't join the voice channel.`);
        } else {
            return message.reply(`I couldn't join the voice channel!`);
        }
    });

    if (!search && !last) {
        message.reply(
            `Searching \`${input}\`. This may take a while...`
        );
    }

    queue.textChannel = message.channel;

    if (playlist) {
        let pl = await queue
            .playlist(input, {
                requestedBy: message.user
            })
            .catch((_, err) => {
                if (err) {
                    console.log(err);
                }
                if (!queue) {
                    queue.stop();
                }
            });

        if (!pl) return message.channel.send("No playlist found!");
    } else {
        let song = await queue.play(input, {
            requestedBy: message.user
        }).catch((_, err) => {
            if (err) {
                console.log(err);
            }
            if (!queue) {
                queue.stop();
            }
        });
        if (!song) return message.channel.send("No track found!");
    }

};