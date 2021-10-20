/** @format */

module.exports = class Unlock extends Command {
	constructor() {
		super({
			name: "unlock",
			aliases: ["unlockchannel"],
			description: "Unlock a channel.",
			usage: "<channel> <reason>",
			category: "<:charliewave_advanced_moderator:857930973715103775> Moderator",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: ["MANAGE_CHANNELS"],
			clientPerms: ["MANAGE_CHANNELS"],
		});
	}
	async exec(message) {
		let channelData = message.mentions.channels.first() || message.channel;

		if (
			channelData.permissionsFor(message.guild.id).has("SEND_MESSAGES") === true
		) {
			return message.reply("This channel is not locked yet.");
		}

		channelData.permissionOverwrites.edit(message.guild.id, {
			SEND_MESSAGES: true,
		});

		message.reply(`Successfully unlocked ${channelData} channel.`);
	}
};
