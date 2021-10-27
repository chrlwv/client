/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Says extends Command {
  constructor() {
    super({
      name: "say",
      aliases: ["says"],
      description:
        "Make the bot to say something you want. (add embed before text to sent it on embed form)",
      usage: "<type> <text>",
      category: "<:charliewave_settings:771462923855069204> Admin",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_GUILD"],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const type = args[0];
    let msg = args.join(" ");

    if (!msg) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}say <type> <text>\``
      );
    }

    message.delete();

    if (type === "embed") {
      msg = args.slice(1).join(" ");
      let emb;
      emb = embed().setColor(0x36393e).setDescription(msg);
      return message.channel.send({ embeds: [emb] });
    }

    message.channel.send(msg);
  }
};
