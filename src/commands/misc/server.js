const {
	embed
} = require("../../utils/Utils");
const {
	stripIndents
} = require("common-tags");

module.exports = class Server extends Command {
	constructor() {
		super({
			name: "server",
			aliases: ["serverinfo", "si", "sinfo", "guild", "ginfo", "guildinfo", "gi"],
			description: "Guild informations and statistics.",
			usage: "",
			category: "Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message) {
		const {
			guild
		} = message;
		const _createdAt = new Date(message.guild.createdAt);

		const guildEmojis = message.guild.emojis.cache.size ?
			message.guild.emojis.cache
			.map(
				(emoji) =>
				`<${emoji.animated == true ? "a" : ""}:${emoji.name}:${emoji.id}>`
			)
			.join(" ")
			.substring(0, 1024)
			.replace(/\s\S+[^>]$/, "") :
			"<:none:989561119268020294>";

		const guildRoles = message.guild.roles.cache
			.map((role) => role.toString())
			.join(" ")
			.substring(0, 1024)
			.replace(/\s\S+[^>]$/, "");

		const members = {
			online: message.guild.members.cache.filter(member => member.presence?.status === "online").size,
			dnd: message.guild.members.cache.filter(member => member.presence?.status === "dnd").size,
			idle: message.guild.members.cache.filter(member => member.presence?.status === "idle").size,
			bots: message.guild.members.cache.filter(member => member.user.bot).size,
		};

		const owner = await message.guild.fetchOwner();

		const guildLevel = {
			NONE: "0",
			TIER_1: "1",
			TIER_2: "2",
			TIER_3: "3"
		}

		const mfaLeveled = {
			NONE: "<:none:989561119268020294>",
			ELEVATED: "Elevated"
		}

		const verificationLevel = {
			NONE: "<:off_mod:989562450384932904> None",
			LOW: "<:low_mod:989562583222734998> Low",
			MEDIUM: "<:medium_mod:989562618639442000> Medium",
			HIGH: "<:high_mod:989562664726454292> High",
			VERY_HIGH: "<:highest_mod:989562693121871953> Very High"
		}

		let emb;
		emb = embed()
			.setColor(0x36393e)
			.setTitle(`${message.guild.name}`)
			.setThumbnail(
				message.guild.iconURL({
					dynamic: true,
					size: 2048,
					format: "png"
				})
			)
			.setDescription(
				`${
					message.guild.description != null
						? message.guild.description + "\n\n"
						: ""
				}ID: ${message.guild.id}`
			)
			.addField(
				`**OWNERSHIP:**`,
				`<:owner:989561605241057280> ${
					owner
				}`,
				true
			)
			.addField(
				`**PARTNERED:**`,
				stripIndents `\
                ${guild.partnered ? '<:on_switch:989561075299151922>' : '<:off_switch:989561108220235846>'}`,
				true
			)
			.addField(
				`**MFALEVEL:**`,
				`${mfaLeveled[guild.mfaLevel]}`,
				true
			)
			.addField(
				`**VERIFICATION LEVEL:**`,
				verificationLevel[message.guild.verificationLevel.toString()],
				true
			)
			.addField(
				`**BOOSTS:**`,
				message.guild.premiumSubscriptionCount +
				` (Level: ${guildLevel[message.guild.premiumTier]})` ||
				"<:none:989561119268020294>",
				true
			)
			.addField(
				`**AFK CHANNEL:**`,
				message.guild.afkChannel ?
				`<:text:989563445122850906> ${message.guild.afkChannel.name}` :
				"<:none:989561119268020294>",
				true
			)
			.addField(
				`**CREATED ON**:`,
				`<t:${Math.floor(_createdAt/1000) + 3600}:F>` +
				`\n${this.constructor.daysAgo(message.guild.createdAt).toFixed(0)} (days ago)`
			)
			.addField(
				`**MEMBERS (${message.guild.memberCount}):**`,
				stripIndents `\
				<:online_badge:989563871847129128> ${members.online} : \
				<:dnd_badge:989563909969182781> ${members.dnd} : \
				<:idle_badge:989563953573138462> ${members.idle} : \
				<:bot_badge:989563823058984960> ${members.bots}`,
				true
			)
			.addField(
				`**EMOJIS (${message.guild.emojis.cache.size}):**`,
				guildEmojis
			)
			.addField(
				`**ROLES (${message.guild.roles.cache.size}):**`,
				guildRoles
			);

		const inviteBanner = guild.bannerURL({
			size: 2048,
			format: "png",
		});

		if (inviteBanner !== null) {
			emb.setImage(inviteBanner);
		}

		return message.reply({
			embeds: [emb]
		});
	}
	static daysAgo(time) {
		var today = new Date();
		var createdOn = new Date(time);
		var msInDay = 24 * 60 * 60 * 1000;

		createdOn.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);

		var diff = (+today - +createdOn) / msInDay;

		return diff;
	}
};