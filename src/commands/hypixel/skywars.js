/** @format */

const { embed } = require("../../utils/Utils");
const { MessageActionRow, MessageButton } = require("discord.js");
const fetch = require("cross-fetch");
const HypixelAPIReborn = require("hypixel-api-reborn");

module.exports = class Skywars extends Command {
  constructor() {
    super({
      name: "skywars",
      aliases: ["sw"],
      description: "Hypixel Network Skywars statistics.",
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
        `Also, provide your Minecraft username.\n\`e.g. ${data.guild?.prefix}skywars Steve\``
      );

    fetch(`https://api.minetools.eu/uuid/${args[0]}`)
      .then((result) => result.json())
      .then(async ({ status }) => {
        if (status === "ERR") {
          return message.reply("Could not fetch provided Mineacraft username.");
        }

        const hypixelAPIReborn = new HypixelAPIReborn.Client(
          this.client.hypixelKey
        );

        hypixelAPIReborn.getPlayer(args[0]).then(async (player) => {
          if (!player.stats.bedwars)
            return message.reply(
              "This user has no data registered on Hypixel Network."
            );

          const buttonWebsite = new MessageButton()
            .setURL(`https://hypixel.net/player/${player.nickname}`)
            .setLabel("Stats")
            .setStyle("LINK");

          const row = new MessageActionRow().addComponents(buttonWebsite);

          let emb;
          emb = embed()
            .setColor(0x36393e)
            .setTitle(`${player.nickname}`)
            .setURL(`https://hypixel.net/player/${player.nickname}`)
            .setThumbnail(
              `https://visage.surgeplay.com/head/512/${player.uuid}`
            )
            .setImage(`https://visage.surgeplay.com/full/512/${player.uuid}`)
            .addField('**LEVEL:**', `${player.stats.skywars.level}`, true)
            .addField('**HEADS:**', `${player.stats.skywars.heads}`, true)
            .addField('**K/D RATIO:**', `${player.stats.skywars.KDRatio}`, true)
            .addField('**W/L RATIO:**', `${player.stats.skywars.WLRatio}`, true)
            .addField('**COINS:**', `${player.stats.skywars.coins}`, true)
            .addField(
              '**TOTAL DEATHS:**',
              `${player.stats.skywars.deaths}`,
              true
            )
            .addField('**TOTAL KILLS:**', `${player.stats.skywars.kills}`, true)
            .addField(
              '**TOTAL RANKED WINS:**',
              `${player.stats.skywars.ranked.wins}`,
              true
            )
            .addField('**TOTAL WINS:**', `${player.stats.skywars.wins}`, true)
            .addField('**TOKENS:**', `${player.stats.skywars.tokens}`, true)
            .addField('**PRESTIGE:**', `${player.stats.skywars.prestige}`, true)
            .addField('**SOULS:**', `${player.stats.skywars.souls}`, true);

          return message.reply({ embeds: [emb], components: [row] });
        });
      });
  }
};
