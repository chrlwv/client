/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class ServerIco extends Command {
	constructor() {
		super({
			name: "serverico",
			aliases: ["serverpic", "svpic"],
			description: "Provide the server icon image.",
			usage: "",
			category: "Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message) {
    const icon = message.guild.iconURL({ dynamic: true, size: 2048 });

    if (icon === null) {
        message.channel.send(lang.GENERAL.GUILD_NO_ICON);
    } else {
        let emb;
		emb = embed()
			.setColor(0x36393e)
			.setTitle(message.guild.name)
            .setDescription(`[.webp](${icon})`)
			.setImage(`${icon}`);
		return message.reply({ embeds: [emb] });
	}
  }
};
