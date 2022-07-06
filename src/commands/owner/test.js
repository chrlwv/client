const fetch = require("node-fetch");

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

        if (!process.env.SKILLZL_API_KEY || process.env.SKILLZL_API_KEY === "") {
            return message.reply('You have not provided `SKILLZL_API_KEY` therefor NSFW commands will not work.');
        }

        return message.reply({
            content: `result.url: *${result.url}*\nresult.code: ${result.code}\nresult.key: \`${result.key}\``,
        });

        message.reply('test: <:on_switch:989561075299151922> passed')
    };
};