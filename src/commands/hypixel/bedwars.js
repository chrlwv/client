/** @format */

const { embed } = require("../../utils/Utils");
const HypixelAPIReborn = require("hypixel-api-reborn");

module.exports = class Bedwars extends Command {
	constructor() {
		super({
			name: "bedwars",
			aliases: ["bw"],
			description:
				"Hypixel Network Bedwars statistics.",
			usage: "<username>",
			category: "<:charliewave_hypixel:771634768777445406> Hypixel",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
    async exec(message, args, data) {
        if (!args.length)
        return message.reply(
            `Also, provide your Minecraft username.\n\`e.g. ${data.guild?.prefix}bedwars Steve\``
        );

        const hypixelAPIReborn = new HypixelAPIReborn.Client(this.client.hypixelKey);

		hypixelAPIReborn.getPlayer(args[0]).then(async (player) => {
			if (!player.stats.bedwars)
            return message.reply('This user has no data registered on Hypixel Network.');

			let emb;
                emb = embed()
                .setColor(0x36393e)
				.setTitle(`${player.nickname}`)
				.setURL(`https://hypixel.net/player/${player.nickname}`)
                .setThumbnail(
                    `https://visage.surgeplay.com/head/512/${player.uuid}`
                )
                .setImage(
                    `https://visage.surgeplay.com/full/512/${player.uuid}`
                )
				.addField("**LEVEL:**", `${player.stats.bedwars.level}`, true)
				.addField("**KD RATIO:**", `${player.stats.bedwars.KDRatio}`, true)
				.addField("**FINAL K/D RATIO:**",
					`${player.stats.bedwars.finalKDRatio}`,
					true
				)
				.addField("**W/L RATIO:**", `${player.stats.bedwars.WLRatio}`, true)
				.addField("**BROKEN BEDS:**",
					`${player.stats.bedwars.beds.broken}`,
					true
				)
				.addField("**BEDS LOST:**", `${player.stats.bedwars.beds.lost}`, true)
				.addField("**COINS:**", `${player.stats.bedwars.coins}`, true)
				.addField("**TOTAL DEATHS:**", `${player.stats.bedwars.deaths}`, true)
				.addField("**FINAL DEATHS:**",
					`${player.stats.bedwars.finalDeaths}`,
					true
				)
				.addField("**TOTAL KILLS:**", `${player.stats.bedwars.kills}`, true)
				.addField("**WINSTREAK:**", `${player.stats.bedwars.winstreak}`, true)
				.addField("**TOTAL WINS:**", `${player.stats.bedwars.wins}`, true);

            return message.reply({ embeds: [emb] });
		});
    } 
};
