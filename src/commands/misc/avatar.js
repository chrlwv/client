const {
  embed
} = require("../../utils/Utils");
const {
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class Avatar extends Command {
  constructor() {
    super({
      name: "avatar",
      aliases: ["av", "pic", "picture"],
      description: "Provide your pfp (profile pic.) or mentioned user.",
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

    const webp = this.constructor.avatar(member, "webp");
    const jpg = this.constructor.avatar(member, "jpg");
    const png = this.constructor.avatar(member, "png");

    const buttonWebp = new MessageButton()
      .setURL(webp)
      .setLabel("webp")
      .setStyle("LINK");

    const buttonJpg = new MessageButton()
      .setURL(jpg)
      .setLabel("jpg")
      .setStyle("LINK");

    const buttonPng = new MessageButton()
      .setURL(png)
      .setLabel("png")
      .setStyle("LINK");

    const row = new MessageActionRow().addComponents(
      buttonWebp,
      buttonJpg,
      buttonPng
    );

    let emb;
    emb = embed()
      .setColor(0x36393e)
      .setTitle(
        `${member.user.tag}`
      )
      .setImage(`${png}`);
    return message.reply({
      embeds: [emb],
      components: [row]
    });
  }

  static avatar(member, format) {
    return member.user.displayAvatarURL({
      dynamic: true,
      size: 1024,
      format,
    });
  }
};