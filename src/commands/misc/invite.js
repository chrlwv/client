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
			.setTitle(
				`${this.client.user.tag} ${this.constructor.getTargetEmojiByStatus(
					this.client.presence.status,
					this.client.presence.clientStatus != undefined &&
						this.client.presence.clientStatus.mobile
				)}`
			)
            .setDescription(`Click [here](${inviteLink}) to invite ${this.client.user.username} on your own server.\n\nMake sure you assign \`applications.commands\` if you want to use the slash-commands.\n\n[website](https://charliewave.me) | [support](https://discord.gg/RPRfpnM6MZ)`)
            .setThumbnail(this.client.user.avatarURL({ dynamic: true, size: 2048, format: "png" }));
        return message.reply({ embeds: [emb] });    
	}

	static getTargetEmojiByStatus(status, mobile) {
        switch (status) {
            case "dnd":
                return "<:charliewave_dnd:771635335486111744>";
            case "idle":
                return "<:charliewave_idle:771635289839501333>";
            case "online":
                return mobile === "online"
                    ? "<:charliewave_mobile:771635443698499584>"
                    : "<:charliewave_online:771635233384693791>";
        }
    }
};
