/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Invite extends Command {
	constructor() {
		super({
			name: "invite",
			aliases: ["invitebot", "botinvite", "inv"],
			description: "Get the invite link for Charliewave.",
			usage: "",
			category: "<:charliewave_general:771633361340727336> Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message) {
		let inviteLink = `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=1916267615&scope=bot%20applications.commands`;

        let emb;
        emb = embed()
            .setColor(0x36393e)
            .setDescription(`Click [here](${inviteLink}) to invite Charliewave on your own server.\n\nMake sure you assign \`applications.commands\` if you want to use the slash-commands.\n\n[website](https://charliewave.me) | [support](https://discord.gg/RPRfpnM6MZ)`)
            .setThumbnail(this.client.user.avatarURL({ dynamic: true, size: 2048, format: "png" }));
        return message.reply({ embeds: [emb] });    
	}
};
