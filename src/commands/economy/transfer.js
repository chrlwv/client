module.exports = class Transfer extends Command {
	constructor() {
		super({
			name: "transfer",
			aliases: ["pay"],
			description: "Transfer coins to another user.",
			usage: "<user> <amount>",
			category: "Economy",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(m) =>
				m.displayName.toLowerCase().includes(args[0]) ||
				m.user.tag.toLowerCase().includes(args[0])
			);

		const amount = Number(args[1]);

		if (!member) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}transfer <user> <amount>\``
			);
		}

		if (member.user.bot) {
			return message.reply(
				"There is no data available for Discord Applications."
			);
		}

		if (!amount) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}transfer <user> <amount>\``
			);
		}

		if (isNaN(amount)) {
			return message.reply('Make sure you enter a valid number.')
		}

		const fee = Math.round(args[1] - args[1] * 0.729);
		const {
			user: receiver
		} = await this.client.getUserById(member.id);
		const {
			user: sender
		} = await this.client.getUserById(message.author.id);

		const coinsGiven = amount - fee;

		if (amount < 0) {
			return message.reply('Make sure you enter a valid number.');
		}

		if (amount > sender.userCoins) {
			return message.reply('Sorry, but you don\'t have that amount of coins.');
		}

		if (message.content.includes("-")) {
			return message.reply('Make sure you enter a valid number.');
		}

		if (receiver.userId === sender.userId) {
			return message.reply('You cannot transfer coins to your own account.');
		}

		await this.client.updateUserById(member.id, {
			coins: receiver.coins + coinsGiven,
		});
		await this.client.updateUserById(message.author.id, {
			coins: sender.coins - amount,
		});

		return message.reply(`Successfully transfered \`${amount.toLocaleString()}\` coins to ${member.user.tag}. \`fee: ${fee.toLocaleString()} (${Math.round((1 - 0.729) * 100)}%)\``);
	}
};