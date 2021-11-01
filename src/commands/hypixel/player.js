/** @format */

const hypixel = require("hypixel-api-nodejs");
const { MessageActionRow, MessageButton } = require("discord.js");
const { embed } = require("../../utils/Utils");

module.exports = class Player extends Command {
  constructor() {
    super({
      name: "player",
      aliases: ["hypixelprofile", "hypixelme"],
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
    String.prototype.toCleanGameType = function () {
      switch (this.toString()) {
        case "BEDWARS":
          return "BedWars";
        case "QUAKECRAFT":
          return "Quake";
        case "WALLS":
          return "Walls";
        case "PAINTBALL":
          return "Paintball";
        case "SURVIVAL_GAMES":
          return "Blitz Survival Games";
        case "TNTGAMES":
          return "TNT Games";
        case "VAMPIREZ":
          return "VampireZ";
        case "WALLS3":
          return "Mega Walls";
        case "ARCADE":
          return "Arcade";
        case "ARENA":
          return "Arena";
        case "UHC":
          return "UHC Champions";
        case "MCGO":
          return "Cops and Crims";
        case "BATTLEGROUND":
          return "Warlords";
        case "SUPER_SMASH":
          return "Smash Heroes";
        case "GINGERBREAD":
          return "Turbo Kart Racers";
        case "HOUSING":
          return "Housing";
        case "SKYWARS":
          return "SkyWars";
        case "TRUE_COMBAT":
          return "Crazy Walls";
        case "SPEED_UHC":
          return "Speed UHC";
        case "SKYCLASH":
          return "SkyClash";
        case "LEGACY":
          return "Classic Games";
        case "PROTOTYPE":
          return "Prototype";
        case "MURDER_MYSTERY":
          return "Murder Mystery";
        case "BUILD_BATTLE":
          return "Build Battle";
        case "DUELS":
          return "Duels";
        case "SKYBLOCK":
          return "SkyBlock";
        case "PIT":
          return "Pit";
        default:
          return "None";
      }
    };

    var ObjectforEach = function (collection, callback, scope) {
      if (Object.prototype.toString.call(collection) === "[object Object]") {
        for (var prop in collection) {
          if (Object.prototype.hasOwnProperty.call(collection, prop)) {
            callback.call(scope, collection[prop], prop, collection);
          }
        }
      } else {
        for (var i = 0, len = collection.length; i < len; i++) {
          callback.call(scope, collection[i], i, collection);
        }
      }
    };

    String.prototype.capitalizeFirst = function () {
      return (
        this.toString().charAt(0).toUpperCase() +
        this.toString().slice(1).toLowerCase()
      );
    };

    String.prototype.toTimeString = function () {
      let num = this.toString();
      if (num < 60) return `${num}m`;
      let hours = num / 60;
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      return `${rhours}h ${rminutes}m`;
    };

    if (!args.length)
      return message.reply(
        `Also, provide your Minecraft username.\n\`e.g. ${data.guild?.prefix}player Steve\``
      );

    const tinodata = { rank: {}, user: {} };

    try {
      hypixel
        .getPlayerByName(this.client.hypixelKey, `${args[0]}`)
        .then((user) => {
          if (
            !user.success ||
            user.success == false ||
            user.player == null ||
            user.player == undefined ||
            !user.player
          ) {
            return message.reply(
              "This user has no data registered on Hypixel Network."
            );
          }
          hypixel
            .getGuildByPlayer(this.client.hypixelKey, `${user.player.uuid}`)
            .then((guild) => {
              switch (user.player.newPackageRank) {
                case "MVP_PLUS":
                  tinodata.rank.displayName = "[MVP+]";
                  tinodata.rank.name = "MVP+";
                  break;
                case "MVP":
                  tinodata.rank.displayName = "[MVP]";
                  tinodata.rank.name = "MVP";
                  break;
                case "VIP_PLUS":
                  tinodata.rank.displayName = "[VIP+]";
                  tinodata.rank.name = "VIP+";
                  break;
                case "VIP":
                  tinodata.rank.displayName = "[VIP]";
                  tinodata.rank.name = "VIP";
                  break;
                default:
                  tinodata.rank.displayName = "";
                  tinodata.rank.name = "None";
              }

              if (user.player.monthlyPackageRank == "SUPERSTAR") {
                tinodata.rank.displayName = "[MVP++]";
                tinodata.rank.name = "MVP++";
              }

              if (user.player.rank != undefined) {
                let rank = user.player.rank;

                if (rank == "YOUTUBER") {
                  tinodata.rank.displayName = "[YouTuber]";
                  tinodata.rank.name = "YouTuber";
                } else {
                  tinodata.rank.displayName =
                    "[" + rank.capitalizeFirst() + "]";
                  tinodata.rank.name = tinodata.rank.displayName
                    .slice(1, tinodata.rank.displayName.length - 1)
                    .capitalizeFirst();
                }
              }

              if (user.player.prefix != undefined) {
                let prefix = user.player.prefix;

                tinodata.rank.displayName = `[${prefix
                  .replace(
                    /[\[\]]|(\§a)|(\§b)|(\§c)|(\§d)|(\§e)|(\§f)|(\§0)|(\§9)|(\§8)|(\§7)|(\§6)|(\§5)|(\§4)|(\§3)|(\§2)|(\§1)|(\§b)|(\§l)|(\§c)|(\§s)|(\§n)|(\§r)/gim,
                    ""
                  )
                  .capitalizeFirst()}]`;
                tinodata.rank.name = tinodata.rank.displayName
                  .slice(1, tinodata.rank.displayName.length - 1)
                  .capitalizeFirst();
              }

              if (user.player.userLanguage)
                tinodata.user.language =
                  user.player.userLanguage.capitalizeFirst();
              else
                tinodata.user.language =
                  "<:charliewave_decline:771454968473190410>";
              if (
                user.player.mcVersionRp &&
                user.player.mcVersionRp != undefined &&
                user.player.mcVersionRp != ""
              )
                tinodata.user.version = user.player.mcVersionRp;
              else
                tinodata.user.version =
                  "<:charliewave_decline:771454968473190410>";
              if (
                guild &&
                guild.guild &&
                guild.guild != undefined &&
                guild.guild != null &&
                guild.success == true &&
                guild.guild.name != undefined &&
                guild.guild.name
              )
                tinodata.user.guild = `[${
                  guild.guild.name
                }](https://hypixel.net/guilds/${guild.guild.name_lower.replace(
                  /[ ]/,
                  "+"
                )})`;
              else
                tinodata.user.guild =
                  "<:charliewave_decline:771454968473190410>";
              if (
                user.player.mostRecentGameType &&
                user.player.mostRecentGameType != undefined
              )
                tinodata.user.recentGameType =
                  user.player.mostRecentGameType.toCleanGameType();

              tinodata.user.level = Math.ceil(
                (Math.sqrt(user.player.networkExp + 15312.5) -
                  125 / Math.sqrt(2)) /
                  (25 * Math.sqrt(2))
              );

              let lastLogin = new Date(user.player.lastLogin);
              let firstLogin = new Date(user.player.firstLogin);

              const buttonWebsite = new MessageButton()
                .setURL(`https://hypixel.net/player/${user.player.displayname}`)
                .setLabel("Stats")
                .setStyle("LINK");

              const row = new MessageActionRow().addComponents(buttonWebsite);

              let emb;
              emb = embed()
                .setColor(0x36393e)
                .setTitle(user.player.displayname)
                .setURL(`https://hypixel.net/player/${user.player.displayname}`)
                .addField("**RANK:**", `${tinodata.rank.name}`, true)
                .addField(
                  "**KARMA POINTS:**",
                  `${user.player.karma == undefined ? 0 : user.player.karma}`,
                  true
                )
                .addField("**LEVEL:**", `${tinodata.user.level}`, true)
                .addField("**LANGUAGE:**", `${tinodata.user.language}`, true)
                .addField("**VERSION:**", `${tinodata.user.version}`, true)
                .addField("**GUILD:**", `${tinodata.user.guild}`, true)
                .addField(
                  "**RECENT GAME:**",
                  `${
                    tinodata.user.recentGameType == undefined
                      ? "<:charliewave_decline:771454968473190410>"
                      : tinodata.user.recentGameType
                  }`,
                  true
                )
                .addField(
                  "**FIRST LOGIN:**",
                  `${this.constructor.pad(
                    firstLogin.getDate()
                  )}/${this.constructor.pad(
                    firstLogin.getMonth() + 1
                  )}/${firstLogin.getFullYear()} - ${this.constructor.pad(
                    firstLogin.getHours()
                  )}:${this.constructor.pad(firstLogin.getMinutes())}`,
                  true
                )
                .addField(
                  "**LAST LOGIN:**",
                  `${this.constructor.pad(
                    lastLogin.getDate()
                  )}/${this.constructor.pad(
                    lastLogin.getMonth() + 1
                  )}/${lastLogin.getFullYear()} - ${this.constructor.pad(
                    lastLogin.getHours()
                  )}:${this.constructor.pad(lastLogin.getMinutes())}`,
                  true
                )
                .setThumbnail(
                  `https://visage.surgeplay.com/head/512/${user.player.uuid}`
                )
                .setImage(
                  `https://visage.surgeplay.com/full/512/${user.player.uuid}`
                );

              if (
                user.player.socialMedia != undefined &&
                user.player.socialMedia.links
              ) {
                emb.addField(`\u200b`, `\u200b`);
                ObjectforEach(
                  user.player.socialMedia.links,
                  function (value, prop, obj) {
                    if (prop == "HYPIXEL")
                      value = `[${
                        value.split("/")[4].split(".")[0]
                      }](${value})`;
                    if (prop == "TWITTER")
                      value = `[${value.split("/")[3]}](${value})`;
                    if (prop == "INSTAGRAM")
                      value = `[${value.split("/")[3]}](${value})`;
                    if (prop == "MIXER")
                      value = `[${value.split("/")[3]}](${value})`;
                    if (prop == "TWITCH")
                      value = `[${value.split("/")[3]}](${value})`;
                    if (
                      prop == "YOUTUBE" &&
                      (value.toLowerCase().includes("/channel/") ||
                        value.toLowerCase().includes("/user/") ||
                        value.toLowerCase().includes("/c/"))
                    )
                      value = `[${value.split("/")[4]}](${value})`;
                    if (
                      prop == "YOUTUBE" &&
                      !(
                        value.toLowerCase().includes("/channel/") ||
                        value.toLowerCase().includes("/user/") ||
                        value.toLowerCase().includes("/c/")
                      )
                    )
                      value = `[${value.split("/")[3]}](${value})`;
                    emb.addField(`**${prop.toUpperCase()}**`, `${value}`, true);
                  }
                );
              }
              return message.reply({ embeds: [emb], components: [row] });
            });
        });
    } catch (e) {
      return message.reply(e);
    }
  }

  static pad(n) {
    return n < 10 ? "0" + n : n;
  }
};
