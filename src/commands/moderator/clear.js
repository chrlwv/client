/** @format */

const { Collection } = require("discord.js");

module.exports = class Clear extends Command {
	constructor() {
		super({
			name: "clear",
			aliases: ["purge", "clean", "prune", "cls"],
			description: "Deletes a bulk of specified messages.",
			usage: "<limit> <option>",
			category: "Moderator",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["MANAGE_MESSAGES"],
			clientPerms: ["MANAGE_MESSAGES"],
		});
	}
	async exec(message, args) {
		Collection.prototype.array = function () {
			return [...this.values()];
		};

		let limit = Number(args[0]);

		if (!limit) {
			limit = 50;
		}

		const filter = null;

		let messages = await message.channel.messages.fetch({ limit: 100 });

		function getFilter(message, filter, user) {
			switch (filter) {
				case "link": {
					return (mes) => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
				}

				case "invite": {
					return (mes) =>
						/(https?:\/\/)?(www\.)?(discord\.(com|gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(
							mes.content
						);
				}

				case "bots": {
					return (mes) => mes.author.bot;
				}

				case "you": {
					return (mes) => mes.author.id === this.client.user.id;
				}

				case "me": {
					return (mes) => mes.author.id === message.author.id;
				}

				case "upload": {
					return (mes) => mes.attachments.size > 0;
				}

				case "user": {
					return (mes) => mes.author.id === user.id;
				}

				default: {
					return () => true;
				}
			}
		}

		if (filter) {
			const user = typeof filter !== "string" ? filter : null;
			const type = typeof filter === "string" ? filter : "user";

			messages = messages.filter(getFilter(message, type, user));
		}

		messages = messages.array().slice(0, limit);
		await message.channel.bulkDelete(messages).then(
			message.channel
				.send(
					`<:charliewave_approve:771455713494040586> found ${
						messages.length
					} messages from ${filter === null ? "everyone" : filter}.`
				)
				.then((msg) => {
					setTimeout(() => {
						msg.delete();
					}, 2000);
				})
		);
	}
};
