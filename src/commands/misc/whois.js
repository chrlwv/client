const {
	embed
} = require("../../utils/Utils");

module.exports = class Whois extends Command {
	constructor() {
		super({
			name: "whois",
			aliases: ["userinfo", "ui", "user"],
			description: "Fetches a user's information. If no user is given, your own information will be displayed.",
			usage: "<user>",
			category: "Misc",
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

		if (!member) {
			return message.reply('No user found.');
		}

		const _createdAt = new Date(member.user.createdAt);
		const _joinedAt = new Date(member.joinedAt);

		const DISCORD_BADGES = {
			DISCORD_EMPLOYEE: "<:discordstaff:989566084036305007>",
			DISCORD_PARTNER: "<:partnered:989566089543421956>",
			BUGHUNTER_LEVEL_1: "<:bughunter:989566087710531624>",
			BUGHUNTER_LEVEL_2: "<:bughuntermaster:989566082438283326>",
			HYPESQUAD_EVENTS: "<:hypesquadevents:989566091426693160>",
			HOUSE_BRAVERY: "<:bravery:989566136133754910>",
			HOUSE_BRILLIANCE: "<:brilliance:989566092403941397>",
			HOUSE_BALANCE: "<:balance:989566094144598016>",
			EARLY_SUPPORTER: "<:earlysupporter:989566085831491587>",
			VERIFIED_BOT: "<:bot_badge:989563823058984960>",
			VERIFIED_DEVELOPER: "<:developer:989566080978673735>",
			DISCORD_CERTIFIED_MODERATOR: "<:moderator:989566079175106600>",
		};

		const TARGET_BADGES = [];

		for (const flags of member.user.flags.toArray()) {
			TARGET_BADGES.push(DISCORD_BADGES[flags]);
		}

		let emb;
		emb = embed()
			.setColor(0x36393e)

			.setTitle(
				`${member.user.tag}`
			)
			.setThumbnail(member.user.displayAvatarURL({
				dynamic: true,
				size: 1024
			}))
			.setDescription(`UID: ${member.user.id}`)
			.addField(
				`**SYSTEM USER:**`,
				member.user.system ? '<:on_switch:989561075299151922>' : '<:off_switch:989561108220235846>',
				true
			)
			.addField(
				`**USERNAME:**`,
				member.user.nickname ? member.user.nickname : "<:none:989561119268020294>",
				true
			)
			.addField(
				`**PARTIAL:**`,
				member.user.partial ? '<:on_switch:989561075299151922>' : '<:off_switch:989561108220235846>',
				true
			)
			.addField(
				`**HIGHEST ROLE:**`,
				member.roles.highest.toString(),
				true
			)
			.addField(
				`**BADGES:**`,
				TARGET_BADGES.length > 0 ? TARGET_BADGES.join(" ") : "<:none:989561119268020294>",
				true
			)
			.addField(
				`**TYPE:**`,
				member.user.bot ?
				'Bot' :
				'Human',
				true
			);

		const TARGET_PRESENCE_LAST =
			member.presence.activities.length > 1 ? "\n**――――――――**\n" : "\n";

		if (
			member.presence != undefined &&
			member.presence.activities.length > 0
		) {
			emb.addField(
				`**PRESENCE:**`,
				`${member.presence.activities.map((activity) => {
					return (
						(
							(activity.emoji != undefined && activity.emoji !== "null"
								? activity.emoji.id != undefined
									? `<${activity.emoji.animated === true ? "a" : ""}:${
											activity.emoji.name
									  }:${activity.emoji.id}>`
									: `${activity.emoji.name}`
								: "") +
							(activity.type != undefined && activity.type !== "null"
								? activity.type === "CUSTOM_STATUS"
									? ""
									: activity.type.toString()
								: "") +
							(activity.name != undefined && activity.name !== "null"
								? activity.name === "Custom Status"
									? activity.state != undefined && activity.state !== "null"
										? " **" + activity.state + "**"
										: ""
									: " **" + activity.name + "**"
								: "") +
							"\n" +
							(activity.details != undefined && activity.details !== "null"
								? activity.details
								: "") +
							"\n" +
							(activity.details != undefined && activity.details !== "null"
								? activity.state != undefined && activity.state !== "null"
									? activity.state
									: ""
								: "") +
							"\n" +
							(activity.timestamps != undefined &&
							activity.timestamps !== "null"
								? this.constructor.formatDate(new Date(activity.timestamps.start).getTime()) +
								  ` elapsed`
								: "") +
							"\n"
						).replace(/(^n\s+|\s+$)/g, "") +
						(member.presence.activities[
							member.presence.activities.length - 1
						] == activity
							? ""
							: TARGET_PRESENCE_LAST)
					);
				})
                }`);
		}

		emb.addField(
			`**CREATED ON:**`,
			`<t:${Math.floor(_createdAt/1000) + 3600}:F>` +
			`\n${this.constructor.daysAgo(member.user.createdAt).toFixed(0)} (days ago)`,
			true
		);
		emb.addField(
			`**JOINED AT:**`,
			`<t:${Math.floor(_joinedAt/1000) + 3600}:F>` +
			`\n${this.constructor.daysAgo(member.joinedAt).toFixed(0)} (days ago)`,
			true
		);

		return message.reply({
			embeds: [emb]
		});

	}

	static formatDate(timestamp) {
		let startTime = timestamp;
		let endTime = Date.now();
		let totalSeconds = (endTime - startTime) / 1000;

		let hours = Math.floor(totalSeconds / 3600);
		let minutes = Math.floor((totalSeconds % 3600) / 60);
		let seconds = Math.floor((totalSeconds % 3600) % 60);

		return `${hours >= 1 ? ("0" + hours).slice(-2) + ":" : ""}${(
            "0" + minutes
        ).slice(-2)}:${("0" + seconds).slice(-2)}`;
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