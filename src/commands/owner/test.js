const fetch = require("node-fetch");
const {
    embed
} = require("../../utils/Utils");

module.exports = class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: [],
            description: "Test command",
            usage: "",
            category: "Owner",
            ownerOnly: true,
            cooldown: 3000,
            memberPerms: [],
            clientPerms: [],
        });
    }
    async exec(message) {
        
        const url = `http://api.skillzl.me/pussy?key=${process.env.SKILLZL_API_KEY}`;
        const result = await fetch(url).then((res) => res.json());

        let emb;
        emb = embed()
            .setColor(0x36393e)
            .setTitle(`pussy 🌸`)
            .setURL(result.url)
            .setImage(result.url);

        return message.reply({
            embeds: [emb]
        });
    };
};