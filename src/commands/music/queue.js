const paginationEmbed = require('discordjs-button-pagination');
const {
    embed
} = require("../../utils/Utils");
const {
    MessageButton
} = require("discord.js");

module.exports = class Queue extends Command {
    constructor() {
        super({
            name: "queue",
            aliases: ["songs"],
            description: "Displays the queue of songs.",
            usage: "",
            category: "Music",
            ownerOnly: false,
            cooldown: 3000,
        });
    }
    async exec(message) {
        let channel = message.member.voice.channel;
        let timeout = 12000;
        if (!channel)
            return message.reply('You must be in a voice channel to use this command!');
        if (message.guild.me.voice.channel && channel !== message.guild.me.voice.channel)
            return message.reply('You must be in the same voice channel as me to use this command!');

        let queue = this.client.player.getQueue(message.guild.id);
        if (!queue || !queue.songs.length)
            return message.reply('There is nothing in the queue!');

        let btn1 = new MessageButton()
            .setCustomId("previousbtn")
            .setLabel("Previous")
            .setStyle("SECONDARY");

        const btn2 = new MessageButton()
            .setCustomId("nextbtn")
            .setLabel("Next")
            .setStyle("PRIMARY");

        let currentEmbedItems = [];
        let embedItemArray = [];
        let pages = [];

        let buttonList = [btn1, btn2];

        if (queue.songs.length > 11) {
            queue.songs.forEach((s, i) => {
                s.index = i;
                if (s.name !== queue.nowPlaying.name) {
                    if (currentEmbedItems.length < 10) currentEmbedItems.push(s);
                    else {
                        embedItemArray.push(currentEmbedItems);
                        currentEmbedItems = [s];
                    }
                }
            });
            embedItemArray.push(currentEmbedItems);
            embedItemArray.forEach((x) => {
                let songs = x
                    .map((s) => `[${s.index}. ${s.name}](${s.url})`)
                    .join("\n");
                let emb;
                emb = embed()
                    .setColor(0x36393e)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(
                        `**Now playing**\n[**${queue.nowPlaying.name}**](${queue.nowPlaying.url})\n\n${songs}`
                    );
                pages.push(emb);
            });

            await paginationEmbed(message, pages, buttonList, timeout);
        } else {
            let songs = queue.songs
                .map((s, i) => {
                    if (s.name !== queue.nowPlaying.name) {
                        return `[${i}. ${s.name}](${s.url})`;
                    }
                })
                .join("\n");

            let emb;
            emb = embed()
                .setColor(0x36393e)
                .setThumbnail(message.guild.iconURL())
                .setDescription(
                    `**Now playing**\n[**${queue.nowPlaying.name}**](${queue.nowPlaying.url})\n\n${songs}`
                )
                .setFooter({
                    text: "Page 1 / 1"
                });
            return message.channel.send({
                embeds: [emb]
            });
        }
    }
};