/** @format */

const { formatArray, formatPerms } = require("../../utils/Utils");
const { Collection, WebhookClient, MessageEmbed } = require("discord.js");
const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));

module.exports = class messageCreate extends Event {
	constructor() {
		super({
			name: "messageCreate",
			once: false,
		});
	}
	async exec(message) {
		const mentionRegPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot || !message.guild) return;
		const data = {};
		if (message.guild)
			data.guild = await this.client.findGuild({ guildID: message.guild.id });
		const prefix = message.content.match(mentionRegPrefix)
			? message.content.match(mentionRegPrefix)[0]
			: data.guild?.prefix;
		if (!message.content.startsWith(prefix)) return;
		const [cmd, ...args] = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		const command =
			this.client.commands.get(cmd.toLowerCase()) ||
			this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (message.guild) {
				const memberCheck = command.memberPerms;
				if (memberCheck) {
					const missing = message.channel
						.permissionsFor(message.member)
						.missing(memberCheck);
					if (missing.length) {
						await message.channel.sendTyping();
						return message.reply(
							`You are missing \`${formatArray(
								missing.map(formatPerms)
							)}\` permission.`
						);
					}
				}
				const clientCheck = command.clientPerms;
				if (clientCheck) {
					const missing = message.channel
						.permissionsFor(message.guild.me)
						.missing(clientCheck);
					if (missing.length) {
						await message.channel.sendTyping();
						return message.reply(
							`I am missing \`${formatArray(
								missing.map(formatPerms)
							)}\` permission.`
						);
					}
				}
			}

			if (command.ownerOnly && !this.client.owners.includes(message.author.id))
				return;
			if (!this.client.cooldowns.has(command.name)) {
				this.client.cooldowns.set(command.name, new Collection());
			}

			if (!message.author.bot) {
				const { user } = await this.client.getUserById(message.author.id);
				const xp = Math.ceil(Math.random() * (5 * 10));
				const level = calculateUserXp(user.exp);
				const newLevel = calculateUserXp(user.exp + xp);
				const guild = await this.client.getGuildById(message.guild.id);

				if (newLevel > level) {
					if (guild.level_msg_module === true) {
						const msg = await message.reply(
							`${message.author.username}, leved up to level ${newLevel}`
						);
						setTimeout(() => {
							msg?.delete();
						}, 10000);
					}
				}

				await this.client.updateUserById(message.author.id, {
					exp: user.exp + xp,
				});
			}

			const now = Date.now();
			const timestamps = this.client.cooldowns.set(command.name);
			const cdAmount = command.cooldown;
			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cdAmount;
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.reply(
						`You need to wait **${timeLeft.toFixed(2)}** seconds!`
					);
				}
			}
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cdAmount);
			try {
				await command.exec(message, args, data);
			} catch (err) {
				const webhookIntegration = new WebhookClient({
					id: "795321440735461396",
					token:
						"CS9iXmXJTx-zLGiGONJaoUh-S8pfHsrHi24ERQQUZSD63ODXhpScCENIhbngE2Bdz1Ws",
				});
				if (!webhookIntegration) {
					return this.client.logger.error(`UNHANDLED ERROR\n\n${err}`, {
						tag: "WebhookIntegration",
					});
				}

				const stack = err.stack || err;

				const embed = new MessageEmbed()
					.setTitle("An error occurred")
					.setDescription(`\`\`\`js\n${stack}\`\`\` `)
					.setColor(0x36393e);

				webhookIntegration.send({
					username: "Charliewave",
					avatarURL:
						"https://cdn.discordapp.com/avatars/772497789561208872/fbdd13287474020008179c89886add56.png?size=1024",
					embeds: [embed],
				});

				this.client.logger.error(
					`An error occurred when trying to trigger MessageCreate event.\n\n${err}`,
					{ tag: "MessageError" }
				);
				return message.reply(
					`Oops, run into a critical error, please wait for a fix.`
				);
			}
		}
	}
};
