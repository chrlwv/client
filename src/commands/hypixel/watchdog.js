/** @format */

var NumAbbr = require("number-abbreviate");
const { embed } = require("../../utils/Utils");
const HypixelAPIReborn = require("hypixel-api-reborn");

var numAbbr = new NumAbbr();

module.exports = class Watchdog extends Command {
  constructor() {
    super({
      name: "watchdog",
      aliases: ["wd"],
      description: "Hypixel Network watchdog anticheats systems statistics.",
      usage: "",
      category: "<:charliewave_hypixel:771634768777445406> Hypixel",
      ownerOnly: false,
      cooldown: 20000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args) {
    const hypixelAPIReborn = new HypixelAPIReborn.Client(
      this.client.hypixelKey
    );

    hypixelAPIReborn.getWatchdogStats().then((stats) => {
      let emb;
      emb = embed()
        .setColor(0x36393e)
        .setThumbnail("https://api.mcsrvstat.us/icon/hypixel.net")
        .setDescription(
          "Watchdog is a Cheat Detection System. It's gathers and analyses data on numerous users randomly at the same time and determines whether a person is using unfair advantages or not."
        )
        .addField(
          "**TOTAL AC BANS:**",
          `${numAbbr.abbreviate(stats.byWatchdogTotal)}`,
          true
        )
        .addField(
          "**LAST MINUTE BANS:**",
          `${numAbbr.abbreviate(stats.byWatchdogLastMinute)}`,
          true
        )
        .addField(
          "**TOTAL MOD BANS:**",
          `${numAbbr.abbreviate(stats.byStaffTotal)}`,
          true
        );

      return message.reply({ embeds: [emb] });
    });
  }
};
