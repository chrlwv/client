/** @format */

const { embed } = require("../../utils/Utils");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = class TrsMembers extends Command {
  constructor() {
    super({
      name: "trsmembers",
      aliases: ["trs", "trash", "trashboys"],
      description: "Trashgang masterpieces.",
      usage: "<text>",
      category: "<:trs:918833132663341076> Trashgang",
      ownerOnly: false,
      cooldown: 300,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args) {
    const backId = "back";
    const forwardId = "forward";
    const backButton = new MessageButton({
      style: "SECONDARY",
      label: "Back",
      emoji: "⬅️",
      customId: backId,
    });
    const forwardButton = new MessageButton({
      style: "SECONDARY",
      label: "Forward",
      emoji: "➡️",
      customId: forwardId,
    });

    let skillzl;
    skillzl = embed()
      .setColor(0x36393e)
      .setImage(
        "https://cdn.discordapp.com/attachments/789862793846325248/918838321394901002/20211205_143556.jpg"
      )
      .setDescription(
        `**pulimiotCatalincik** (${
          this.client.users.cache.get("565960314970177556").tag
        })\noleaca skinhead`
      );

    let mqr;
    mqr = embed()
      .setColor(0x36393e)
      .setImage(
        "https://cdn.discordapp.com/attachments/789862793846325248/918838322451845150/unknown-4.png"
      )
      .setDescription(
        `**mkiurius** ({
          this.client.users.cache.get("477520800073908232").tag
        })\nbagatii cilovek`
      );

    let genius;
    genius = embed()
      .setColor(0x36393e)
      .setImage(
        "https://cdn.discordapp.com/attachments/789862793846325248/918838322162442270/Screenshot_20211005-110917_Instagram.jpg"
      )
      .setDescription(
        `**iancik** ({
          this.client.users.cache.get("295579432343568394").tag
        })\npizdatie a4ki`
      );

    let chill;
    chill = embed()
      .setColor(0x36393e)
      .setImage(
        "https://cdn.discordapp.com/attachments/789862793846325248/918838321659117628/Screenshot_20211202-173925_Snapchat.jpg"
      )
      .setDescription(
        `**micu afgon** (${
          this.client.users.cache.get("462294547855048714").tag
        })\ndriller ebanii`
      );

    let nikitos;
    nikitos = embed()
      .setColor(0x36393e)
      .setImage(
        "https://cdn.discordapp.com/attachments/789862793846325248/918838321927569418/IMG_20211121_135754_081.webp"
      )
      .setDescription(
        `**nikitos** (${
          this.client.users.cache.get("455004835658596363").tag
        })\nbalsoi mujik`
      );

    const pages = [skillzl, mqr, genius, chill, nikitos];
  }
};
