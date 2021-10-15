/** @format */

module.exports = class Lock extends Command {
	constructor() {
		super({
			name: "lock",
			aliases: ["lockchannel"],
			description: "Lock a channel.",
			usage: "<channel> <reason>",
			category: "Moderator",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["MANAGE_CHANNELS"],
			clientPerms: ["MANAGE_CHANNELS"],
		});
	}
	async exec(message, args) {
		let reason = args.join(" ");
		let channelData = message.mentions.channels.first();

		if (channelData) {
			reason = args.join(" ").slice(22);
		} else {
			channelData = message.channel;
		}

		if (
			channelData.permissionsFor(message.guild.id).has("SEND_MESSAGES") ===
			false
		) {
			return message.reply("This channel is already locked.");
		}

		if (!reason) reason = "no reason";

		channelData.permissionOverwrites.edit(message.guild.id, {
			SEND_MESSAGES: false,
		});

		message.reply(
			`Successfully locked ${channelData} channel, reason: ${reason}`
		);
	}
};
