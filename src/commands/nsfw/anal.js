const fetch = require("node-fetch");
const {
    embed
} = require("../../utils/Utils");

module.exports = class Anal extends Command {
    constructor() {
        super({
            name: "anal",
            aliases: [],
            description: "Sends a random 🍑 stuff gif.",
            usage: "",
            category: "NSFW",
            ownerOnly: false,
            cooldown: 3000,
        });
    }
    async exec(message) {

        if (!message.channel.nsfw) {
            return message.reply('This content cannot be displayed here, use a channel that allows NSFW content.');
        }

        if (!process.env.SKILLZL_API_KEY || process.env.SKILLZL_API_KEY === "") {
            return message.reply('You have not provided `SKILLZL_API_KEY` therefor NSFW commands will not work.');
        }

        const url = `http://api.skillzl.me/anal?key=${process.env.SKILLZL_API_KEY}`;
        const result = await fetch(url).then((res) => res.json());

        let emb;
        emb = embed()
            .setColor(0x36393e)
            .setTitle(`anal 🍑`)
            .setURL(result.url)
            .setImage(result.url)
            .setFooter({
                text: 'api.skillzl.me'
            })

        return message.reply({
            embeds: [emb]
        });

    }
};