/** @format */

module.exports = class Deposit extends Command {
	constructor() {
		super({
			name: "deposit",
			aliases: ["bank"],
			description: "Deposit coins to bank.",
			usage: "<amount>",
			category: ":coin: Economy",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		const { user } = await this.client.getUserById(message.author.id);

		const coinsPurse = user.coins;
		let amount = args.slice(0).join(" ");

		if (!amount) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}deposit <amount>\``
			);
		}

		if (amount === "all") {
			await this.client.updateUserById(message.author.id, {
				bank: user.bank + coinsPurse,
				coins: user.coins - coinsPurse,
			});

			return message.reply('Successfully deposited all your coins.');
		}

		amount = Number(args[0]);

    if (typeof amount !== "number" || isNaN(amount)) {
      return message.reply("Make sure you enter a valid number.");
    }
		
		if (message.content.includes("-")) {
			return message.reply('Make sure you enter a valid number.');
		}

		if (amount < 0) {
			return message.reply('Make sure you enter a valid number.');
		}

		if (coinsPurse < amount) {
			return message.reply('Sorry, but you don\'t have that amount of coins.');
		}

		await this.client.updateUserById(message.author.id, {
			bank: user.bank + Number(amount),
			coins: user.coins - amount,
		});

		message.channel.send(`Successfully deposited \`${amount.toLocaleString()}\` into your bank.`);
	}
};
