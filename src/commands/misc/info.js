/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Informations extends Command {
	constructor() {
		super({
			name: "info",
			aliases: ["bot", "botinfo", "aboutbot"],
			description: "About Charliewave Discord application.",
			usage: "",
			category: "<:charliewave_general:771633361340727336> Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {

        if(args.join(" ")) { 
            message.react('😄');
        }

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
            .setDescription(`${this.client.user.username} is an experienced multipurpose bot that has a ton of features you will enjoy using.\n\nUse \`${data.guild?.prefix}help\` so you can interact with <@${this.client.user.id}> and make sure you understand all of it's features.\n\n[website](https://charliewave.me) | [support](https://discord.gg/RPRfpnM6MZ) | [github](https://github.com/charliewave-me)`)
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
