const {
	stripIndents
} = require("common-tags");

module.exports = class Slots extends Command {
	constructor() {
		super({
			name: "slots",
			aliases: ["slot", "casino"],
			description: "Try out the slots and make some changes to your account, by winning coins and experience.",
			usage: "<amount>",
			category: ":coin: Economy",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		const {
			user
		} = await this.client.getUserById(message.author.id);
		const amount = args.slice(0).join(" ");
		const coins_db = user.userCoins;

		const slots = [
			"<a:charliewave_slotscherry:771477963514183680>",
			"<a:charliewave_slotswatermelon:771477405407117343>",
			"<a:charliewave_slotsseven:771477517319274581>",
			"<a:charliewave_slotslemon:771477851563229184>",
			"<a:charliewave_slotsgrape:771477892466999307>",
			"<a:charliewave_slotsgamble:771477799713374239>",
			"<a:charliewave_slotscoin:771477760857079828>",
		];

		if (!amount) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}slots <amount>\``
			);
		}

		if (isNaN(amount)) return message.reply('Make sure you enter a valid number.');

		if (!isFinite(amount)) message.reply('Make sure you enter a valid number.');

		if (amount > coins_db)
			return message.reply('Sorry, but you don\'t have that amount of coins.');

		if (amount < 100) return message.reply('The minimum bet you can play is \`100\`.');

		if (amount > 100000)
			return message.reply('The maximum bet you can play is \`100,000\`.');

		const random = 5 * amount;

		const arr1 = this.constructor.shuffle(slots);
		const arr2 = this.constructor.shuffle(slots);
		const arr3 = this.constructor.shuffle(slots);

		const slotMsg = message.channel
			.send(
				stripIndents `
[ :: **SLOTS** :: ]
----------------
${arr1[2]} : ${arr2[0]} : ${arr3[2]}
            
${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
            
${arr1[0]} : ${arr2[2]} : ${arr3[0]}
----------------
[ :: **SLOTS** :: ]`
			)
			.then(async (msg) => {
				for (let i = 0; i < 5; i++) {
					arr1.push(arr1.shift());
					arr2.push(arr2.shift());
					arr3.push(arr3.shift());

					setTimeout(
						() =>
						msg.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${arr1[0]} : ${arr2[1]} : ${arr3[0]}
              
${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
              
${arr1[0]} : ${arr2[2]} : ${arr3[0]}
----------------
[ :: **SLOTS** :: ]`),
						800
					);

					setTimeout(
						() =>
						msg.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${arr1[0]} : ${arr2[1]} : ${arr3[0]}
              
${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
              
${arr1[0]} : ${arr2[2]} : ${arr3[0]}
----------------
[ :: **SLOTS** :: ]`),
						1300
					);

					if (
						(arr1[1] === arr2[1] && arr1[1] === arr3[1]) ||
						(arr1[1] && arr2[1] === arr1[1] && arr3[1]) ||
						(arr2[1] === arr1[1] && arr2[1] === arr3[1]) ||
						(arr3[1] === arr2[1] && arr3[1] === arr1[1]) ||
						(arr3[1] && arr2[1] === arr3[1] && arr1[1]) ||
						(arr1[1] === arr3[1] && arr3[1] && arr2[1])
					) {
						await this.client.updateUserById(message.author.id, {
							coins: user.coins + random,
						});
						return setTimeout(
							() =>
							msg.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${arr1[2]} : ${arr2[0]} : ${arr3[2]}

${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
              
${arr1[0]} : ${arr2[2]} : ${arr3[0]}
----------------
[ :: **SLOTS** :: ]
${message.author.tag} won ${random.toLocaleString()} :coin:. \`(bet: ${amount.toLocaleString()})\``),
							2300
						);
					}

					await this.client.updateUserById(message.author.id, {
						coins: user.coins - amount,
					});
					return setTimeout(
						() =>
						msg.edit(stripIndents `
[ :: **SLOTS** :: ]
----------------
${arr1[2]} : ${arr2[0]} : ${arr3[2]}
                  
${arr1[1]} : ${arr2[1]} : ${arr3[1]} **«**
                  
${arr1[0]} : ${arr2[2]} : ${arr3[0]}
----------------
[ :: **SLOTS** :: ]
${message.author.tag} lost everything. \`(bet: ${amount.toLocaleString()})\``),
						2300
					);
				}
			});

	}

	static shuffle(array) {
		const arr = array.slice(0);
		for (let i = arr.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}
};