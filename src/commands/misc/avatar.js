/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Avatar extends Command {
	constructor() {
		super({
			name: "avatar",
			aliases: ["av", "pic", "picture"],
			description: "Provide your pfp (profile pic.) or mentioned user.",
			usage: "<user>",
			category: "<:charliewave_general:771633361340727336> Misc",
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

		const webp = this.constructor.avatar(member, "webp");
		const jpg = this.constructor.avatar(member, "jpg");
		const png = this.constructor.avatar(member, "png");

		let emb;
		emb = embed()
			.setColor(0x36393e)
			.setTitle(
				`${member.user.tag} ${this.constructor.getTargetEmojiByStatus(
					member.presence.status,
					member.presence.clientStatus != undefined &&
						member.presence.clientStatus.mobile
				)}`
			)
			.setDescription(`[.webp](${webp}) - [.png](${png}) - [.jpg](${jpg})`)
			.setImage(`${webp}`);
		return message.reply({ embeds: [emb] });
	}

	static avatar(member, format) {
		return member.user.displayAvatarURL({
			dynamic: true,
			size: 1024,
			format,
		});
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
