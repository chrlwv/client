/** @format */

const huntJson = require("../../data/hunt.json");
const { stripIndent } = require("common-tags");
const ms = require("ms");

module.exports = class Hunt extends Command {
	constructor() {
		super({
			name: "hunt",
			aliases: [],
			description: "Play at hunting minigame to warn XP and coins.",
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

        const animalID = Math.floor(Math.random() * 10) + 1;
		let rarity;
		if (animalID < 5) rarity = "junk";
		else if (animalID < 8) rarity = "common";
		else if (animalID < 9) rarity = "uncommon";
		else if (animalID < 10) rarity = "rare";
		else rarity = "legendary";
		const animal = huntJson[rarity];
		const worth = this.constructor.randomRange(animal.min, animal.max);

		const { user } = await this.client.getUserById(message.author.id);
		const huntcooldown = user.hunt_cooldown;

		if (huntcooldown !== null && timeout - (Date.now() - huntcooldown) > 0) {
			let time = ms(timeout - (Date.now() - huntcooldown), { long: true });

			message.channel.send(`You've already hunted recently, \`${time}\` remaining.`);
		} else {
			const xp = Math.floor(Math.random() * 10) + 1;

			if (!args[0]) {
				message.channel.send(stripIndent`
[ :: **HUNT MINIGAME** :: ]
----------------------------
Hunter:  
\u3000 ${message.author.tag}
Hunted animal:
\u3000 \`${animal.symbol}\`
Coins earned:
\u3000 \`${worth} 🪙\`
Exp earned:
\u3000 \`${xp} ❇️\`
----------------------------
[ :: **HUNT MINIGAME** :: ]
`);

				await this.client.updateUserById(message.author.id, {
					coins: user.coins + worth,
					exp: user.exp + xp,
					hunt_cooldown: Date.now(),
				});
			}
		}
	
	}

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
