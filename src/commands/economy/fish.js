/** @format */

const fishJson = require("../../data/fish.json");
const { stripIndent } = require("common-tags");
const ms = require("ms");

module.exports = class Fish extends Command {
	constructor() {
		super({
			name: "fish",
			aliases: [],
			description: "Play at fishing minigame to warn XP and coins.",
			usage: "",
			category: ":coin: Economy",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args) {
        const timeout = 600000;

        const fishID = Math.floor(Math.random() * 10) + 1;
		let rarity;
		if (fishID < 5) rarity = "junk";
		else if (fishID < 8) rarity = "common";
		else if (fishID < 9) rarity = "uncommon";
		else if (fishID < 10) rarity = "rare";
		else rarity = "legendary";
		const fish = fishJson[rarity];
		const worth = this.constructor.randomRange(fish.min, fish.max);

		const { user } = await this.client.getUserById(message.author.id);
		const fishcooldown = user.fish_cooldown;

		if (fishcooldown !== null && timeout - (Date.now() - fishcooldown) > 0) {
			let time = ms(timeout - (Date.now() - fishcooldown), { long: true });

			message.channel.send(`You've already fished recently, \`${time}\` remaining.`);
		} else {
			const xp = Math.floor(Math.random() * 10) + 1;

			if (!args[0]) {
				message.channel.send(stripIndent`
[ :: **FISH MINIGAME** :: ]
----------------------------
Fisherman:  
\u3000 ${message.author.tag}
Caught:
\u3000 \`${fish.symbol}\`
Coins earned:
\u3000 \`${worth} 🪙\`
Exp earned:
\u3000 \`${xp} ❇️\`
----------------------------
[ :: **FISH MINIGAME** :: ]
`);

				await this.client.updateUserById(message.author.id, {
					coins: user.coins + worth,
					exp: user.exp + xp,
					fish_cooldown: Date.now(),
				});
			}
		}
	
	}

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
