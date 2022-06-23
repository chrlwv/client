module.exports = class Withdraw extends Command {
	constructor() {
		super({
			name: "withdraw",
			aliases: ["atm"],
			description: "Withdraw coins from bank.",
			usage: "<amount>",
			category: "Economy",
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

		const coinsBank = user.bank;
		let amount = args.slice(0).join(" ");

		if (!amount) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}withdraw <amount>\``
			);
		}

		if (amount === "all") {
			await this.client.updateUserById(message.author.id, {
				coins: user.coins + coinsBank,
				bank: user.bank - coinsBank,
			});

			return message.reply('Successfully deposited all your coins.');
		}

		amount = Number(args[0]);

		if (typeof amount !== "number" || isNaN(amount)) {
			return message.reply('Make sure you enter a valid number.');
		}

		if (message.content.includes("-")) {
			return message.reply('Make sure you enter a valid number.');
		}

		if (amount < 0) {
			return message.reply('Make sure you enter a valid number.');
		}

		if (coinsBank < amount) {
			return message.reply('Sorry, but you don\'t have that amount of coins.');
		}

		await this.client.updateUserById(message.author.id, {
			coins: user.coins + Number(amount),
			bank: user.bank - amount,
		});

		message.channel.send(`Successfully deposited \`${amount.toLocaleString()}\` into your bank.`);
	}
};