const {
  embed
} = require("../../utils/Utils");
const {
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class ServerIco extends Command {
  constructor() {
    super({
      name: "serverico",
      aliases: ["serverpic", "svpic"],
      description: "Provide the server icon image.",
      usage: "",
      category: "Misc",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
    const webp = this.constructor.iconFetch(message, "webp");
    const jpg = this.constructor.iconFetch(message, "jpg");
    const png = this.constructor.iconFetch(message, "png");

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

    if (webp === null) {
      message.channel.send("This guild have no icon.");
    } else {
      let emb;
      emb = embed()
        .setColor(0x36393e)
        .setTitle(message.guild.name)
        .setImage(`${png}`);
      return message.reply({
        embeds: [emb],
        components: [row]
      });
    }
  }

  static iconFetch(message, format) {
    return message.guild.iconURL({
      dynamic: true,
      size: 1024,
      format,
    });
  }
};