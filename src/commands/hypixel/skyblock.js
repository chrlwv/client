/** @format */

var NumAbbr = require("number-abbreviate");
const fetch = require("cross-fetch");
const { MessageActionRow, MessageButton } = require("discord.js");
const { embed } = require("../../utils/Utils");

var numAbbr = new NumAbbr();

module.exports = class Skyblock extends Command {
  constructor() {
    super({
      name: "skyblock",
      aliases: ["sb"],
      description:
        "Featches hypixel skyblock informations for an argued minecraft username.",
      usage: "<username>",
      category: "<:charliewave_hypixel:771634768777445406> Hypixel",
      ownerOnly: false,
      cooldown: 20000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    if (!args.length)
      return message.reply(
        `Also, provide your Minecraft username.\n\`e.g. ${data.guild?.prefix}skyblock Steve\``
      );
    let emb;

    fetch(`https://api.minetools.eu/uuid/${args[0]}`)
      .then((result) => result.json())
      .then(async ({ id, name, status }) => {
        const fetchProf = await fetch(
          `https://api.slothpixel.me/api/skyblock/profile/${args[0]}`
        );
        const playerUUIDFetch = await fetch(
          `https://api.minetools.eu/uuid/${args[0]}`
        );
        const playerUUIDData = await playerUUIDFetch.json();
        const profileData = await fetchProf.json();

        if (status === "ERR") {
          return message.reply("Could not fetch provided Mineacraft username.");
        }

        const buttonWebsite = new MessageButton()
          .setURL(`https://sky.shiiyu.moe/stats/${playerUUIDData.id}`)
          .setLabel("Shiiyo.moe")
          .setStyle("LINK");

        const row = new MessageActionRow().addComponents(buttonWebsite);

        emb = embed()
          .setColor(0x36393e)
          .setTitle(`${name}`)
          .setURL(`https://sky.shiiyu.moe/stats/${playerUUIDData.id}`)
          .setThumbnail(
            `https://visage.surgeplay.com/head/512/${playerUUIDData.id}`
          )
          .setDescription(profileData.cute_name);

        if (
          profileData.members[id].armor[3].name != null ||
          (profileData.members[id].armor[3].name != undefined &&
            profileData.members[id].armor[2].name != null) ||
          (profileData.members[id].armor[2].name != undefined &&
            profileData.members[id].armor[2].name != null) ||
          (profileData.members[id].armor[2].name != undefined &&
            profileData.members[id].armor[1].name != null) ||
          profileData.members[id].armor[1].name != undefined
        )
          emb.addField(
            "**ARMOR:**",
            profileData.members[id].armor[3].name
              .replace(/§/g, "")
              .replace(/\d+/, "")
              .replace("d", "")
              .replace("f", "")
              .replace(/6/g, "") +
              `\n` +
              profileData.members[id].armor[2].name
                .replace(/§/g, "")
                .replace(/\d+/, "")
                .replace("d", "")
                .replace("f", "")
                .replace(/6/g, "") +
              `\n` +
              profileData.members[id].armor[1].name
                .replace(/§/g, "")
                .replace(/\d+/, "")
                .replace("d", "")
                .replace("f", "")
                .replace(/6/g, "") +
              `\n` +
              profileData.members[id].armor[0].name
                .replace(/§/g, "")
                .replace(/\d+/, "")
                .replace("d", "")
                .replace("f", "")
                .replace(/6/g, "")
          );
        emb.addField(
          "**STATS:**",
          `<:Health_icon:852570156261834762> ${profileData.members[
            id
          ].attributes.health.toLocaleString()} | <:Absorption_icon:852570156110184489> ${profileData.members[
            id
          ].attributes.effective_health.toLocaleString()} \n<:Defense_icon:852570156211503109> ${profileData.members[
            id
          ].attributes.defense.toLocaleString()} | <:Strength_icon:852570155966791692> ${profileData.members[
            id
          ].attributes.strength.toLocaleString()}\n<:Speed_icon:852570156198133790> ${profileData.members[
            id
          ].attributes.speed.toLocaleString()}% | <:Intelligence_icon:852570156239683594> ${profileData.members[
            id
          ].attributes.intelligence.toLocaleString()}`,
          true
        );

        let petStatsContainter;

        const petStatistics = `[LVL ${
          profileData.members[id].active_pet.level
        }] ${profileData.members[id].active_pet.name}\n${
          profileData.members[id].active_pet.rarity
        }\nExp: ${numAbbr.abbreviate(profileData.members[id].active_pet.exp)}`;

        if (petStatistics != null || petStatistics != undefined)
          petStatsContainter = petStatistics;

        if (petStatsContainter.includes("undefined"))
          petStatsContainter = "No Active Pet";

        emb.addField("**ACTIVE PET:**", petStatsContainter, true);
        emb.addField(
          "**AUCTIONS:**",
          `Fees: ${numAbbr.abbreviate(
            profileData.members[id].stats.auctions.total_fees
          )}\nGold Earned: ${numAbbr.abbreviate(
            profileData.members[id].stats.auctions.gold_earned
          )}\nGold Spent: ${numAbbr.abbreviate(
            profileData.members[id].stats.auctions.gold_spent
          )}`,
          true
        );
        emb.addField(
          "**AVG SKILL LEVEL:**",
          `${profileData.members[id].average_skill_level}`,
          true
        );
        emb.addField(
          "**FAIRY SOULS:**",
          `${profileData.members[id].fairy_souls_collected}/227`,
          true
        );
        emb.addField(
          "**HIGHEST DELT DMG:**",
          `${numAbbr.abbreviate(
            profileData.members[id].stats.highest_critical_damage
          )}`,
          true
        );
        emb.addField(
          "**GIFTS:**",
          `Given: ${numAbbr.abbreviate(
            profileData.members[id].stats.gifts_given
          )}\nReceived: ${numAbbr.abbreviate(
            profileData.members[id].stats.gifts_received
          )}`,
          true
        );

        let BankStatsContainter;

        const BankStatistics = `Bank: ${numAbbr.abbreviate(
          profileData.banking.balance
        )}\nPurse: ${numAbbr.abbreviate(profileData.members[id].coin_purse)}`;

        if (BankStatistics != null || BankStatistics != undefined)
          BankStatsContainter = BankStatistics;

        if (BankStatsContainter.includes("null")) BankStatsContainter = "0";

        emb.addField("**COINS:**", BankStatsContainter, true);
        emb.addField(
          "**JERRY'S WORKSHOP:**",
          `Snowballs Hits: ${numAbbr.abbreviate(
            profileData.members[id].stats.winter_records.snowballs_hit
          )}\nDamage: ${numAbbr.abbreviate(
            profileData.members[id].stats.winter_records.damage
          )}`,
          true
        );
        return message.reply({ embeds: [emb], components: [row] });
      });
  }
};
