/** @format */

module.exports = class TrsCock extends Command {
  constructor() {
    super({
      name: "cock",
      aliases: ["puta", "putza", "cilen", "cucu", "pula"],
      description: "Trashgang cock command.",
      usage: "<user>",
      category: "<:trs:918833132663341076> Trashgang",
      ownerOnly: false,
      cooldown: 300,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args) {
    if (message.guild.id !== "546405460811448320")
      return message.reply("Private command. Failed to execute!");

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (m) =>
          m.displayName.toLowerCase().includes(args[0]) ||
          m.user.tag.toLowerCase().includes(args[0])
      ) ||
      message.member;

    let rate = Math.round(Math.random() * 36);

    await message
      .reply(
        `${member.user.tag}, :wave_tone5:\ncucu-metru arata ${rate} cm la cuc pe azi, vezi ai grija sa nu ti se infle vreun ou`
      )
      .then(function (message) {
        message.react("👍🏿");
      });

    const filter = (reaction, user) => {
      return ["👍🏿"].includes(reaction.emoji.name) && user.id === member.id;
    };

    message
      .awaitReactions({ filter, max: 1, time: 4000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "👍🏿") {
          message.reply("oo klass patan");
        } else {
          message.reply("eee barbate, ne suparam");
        }
      })
      .catch((collected) => {
        message.reply("nice cock, nice");
      });
  }
};
