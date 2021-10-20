/** @format */

Fetch = require("node-fetch").default;
const { embed } = require("../../utils/Utils");

module.exports = class Minecraft extends Command {
	constructor() {
		super({
			name: "minecraft",
			aliases: ["mc", "mcserv", "minecraftserver", "mcserver"],
			description: "Fetches public informations about a third-party rminecraft server.",
			usage: "<ip_address>",
			category: "Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		const ip_address = args.slice(0).join(" ");
		if (!ip_address) { 
            return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}minecraft <ip_address>\``
			);
        }

		const response = await Fetch(`https://api.mcsrvstat.us/2/${ip_address}`);
		const json = await response.json();

		if (!json.online) return message.reply(`Sorry I cannot provide \`jsonRespone\` for \`${ip_address}\` address.`);

		let emb;
		emb = embed()
            .setColor(0x36393e)
			.setDescription(`${json.hostname || ip_address}`)
			.setThumbnail(`https://api.mcsrvstat.us/icon/${ip_address}`)
			.addField(
				`**STATUS:**`,
				json.online ? 'online' : 'offline',
				true
			)
			.addField(
				`**PLAYERS:**`, json.players.online + "/" + json.players.max, true
			)
			.addField(`**VERSION:**`, json.version || "n/a", true)
            
            let serverMotd = json.motd.clean.slice(0, 100);

            if (json.motd && json.motd.clean && json.motd.clean.length > 1) {
                emb.addField(
                    `**MOTD:**`,
                    `${serverMotd}`
                );
            }
		return message.reply({ embeds: [emb] });
	}
};
