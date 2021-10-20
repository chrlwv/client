/** @format */

const { embed } = require("../../utils/Utils");
const { stripIndents } = require("common-tags");

module.exports = class Server extends Command {
	constructor() {
		super({
			name: "server",
			aliases: ["serverinfo", "si", "sinfo", "guild", "ginfo", "guildinfo", "gi"],
			description: "Guild informations and statistics.",
			usage: "",
			category: "<:charliewave_general:771633361340727336> Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message) {
		const { guild } = message;
        const _createdAt = new Date(message.guild.createdAt);
		const _createdAt_Y = new Intl.DateTimeFormat("en", {
			year: "numeric",
		}).format(_createdAt);
		const _createdAt_M = new Intl.DateTimeFormat("en", {
			month: "short",
		}).format(_createdAt);
		const _createdAt_D = new Intl.DateTimeFormat("en", {
			day: "2-digit",
		}).format(_createdAt);

		const GUILD_CREATED_AT = `${_createdAt_D} **${_createdAt_M.toUpperCase()}** ${_createdAt_Y}`;

        const guildEmojis = message.guild.emojis.cache.size
			? message.guild.emojis.cache
					.map(
						(emoji) =>
							`<${emoji.animated == true ? "a" : ""}:${emoji.name}:${emoji.id}>`
					)
					.join(" ")
					.substring(0, 1024)
					.replace(/\s\S+[^>]$/, "")
			: "<:charliewave_decline:771454968473190410>";

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

        let emb;
		emb = embed()
        .setColor(0x36393e)
        .setTitle(`${message.guild.name}`)
			.setThumbnail(
				message.guild.iconURL({ dynamic: true, size: 2048, format: "png" })
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
				`<:charliewave_ownership:771637500967124994> ${
					owner
				}`,
				true
			)
			.addField(
				`**PARTNERED:**`,
				stripIndents`\
                ${guild.partnered ? '<:charliewave_approve:771455713494040586>' : '<:charliewave_decline:771454968473190410>'}`,
				true
			)
			.addField(
				`**MFALEVEL:**`,
				`${guild.mfaLevel}`,
				true
			)
			.addField(
				`**VERIFICATION LEVEL:**`,
				message.guild.verificationLevel.toString(),
				true
			)
			.addField(
				`**BOOSTS:**`,
				message.guild.premiumSubscriptionCount +
					` (Level: ${guildLevel[message.guild.premiumTier]})` ||
					"<:charliewave_decline:771454968473190410>",
				true
			)
			.addField(
				`**AFK CHANNEL:**`,
				message.guild.afkChannel
					? `<:charliewave_text:771637634572222475> ${message.guild.afkChannel.name}`
					: "<:charliewave_decline:771454968473190410>",
				true
			)
			.addField(
				`**CREATED ON**:`,
				GUILD_CREATED_AT +
					`\n${this.constructor.daysAgo(message.guild.createdAt).toFixed(0)} (days ago)`
			)
			.addField(
				`**MEMBERS (${message.guild.memberCount}):**`,
				stripIndents`\
              <:charliewave_online:771635233384693791> ${members.online} : \
              <:charliewave_dnd:771635335486111744> ${members.dnd} : \
              <:charliewave_idle:771635289839501333> ${members.idle} : \
              <:charliewave_bot:771636943632859136> ${members.bots}`,
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
            


            return message.reply({ embeds: [emb] }); 
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
