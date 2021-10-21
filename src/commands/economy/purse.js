/** @format */

module.exports = class Purse extends Command {
	constructor() {
		super({
			name: "purse",
			aliases: ["bal", "balance", "coins"],
			description: "Check out our purse worth of coins.",
			usage: "",
			category: ":coin: Economy",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args) {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(m) =>
					m.displayName.toLowerCase().includes(args[0]) ||
					m.user.tag.toLowerCase().includes(args[0])
			) ||
			message.member;
	
			if (member.user.bot) {
				return message.reply(
					"There is no data available for Discord Applications."
				);
			}

		const { user } = await this.client.getUserById(member.id);

		let coinsTotal = user.bank + user.coins;

		message.reply(`:coin: ${member.user.tag} has \`${user.coins.toLocaleString()}\` coins in hand and \`${user.bank.toLocaleString()}\` coins in the bank account.\nTotal: \`${coinsTotal.toLocaleString()}\``);
	}
};
