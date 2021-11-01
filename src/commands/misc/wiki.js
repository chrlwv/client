/** @format */

const wiki = require("wikijs").default();
const { MessageActionRow, MessageButton } = require("discord.js");
const { embed } = require("../../utils/Utils");

module.exports = class Wikipedia extends Command {
  constructor() {
    super({
      name: "wiki",
      aliases: ["wikipedia"],
      description: "Search queries on Wikipedia website.",
      usage: "<query>",
      category: "<:charliewave_general:771633361340727336> Misc",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    if (!args.length) {
      return message.reply(
        `Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}wiki <query>\``
      );
    }

    const search = await wiki.search(args.join(" "));

    if (!search.results[0]) {
      return message.reply(
        `Sorry I wasn\'t able to find something with \`${args.join(
          " "
        )}\` query.`
      );
    }

    const result = await wiki.page(search.results[0]);
    const description = await result.summary();
    const title = result.raw.title;
    const url = result.raw.fullurl;

    const buttonReadMore = new MessageButton()
      .setURL(url)
      .setLabel("read more")
      .setStyle("LINK");

    const row = new MessageActionRow().addComponents(buttonReadMore);

    let emb;
    emb = embed()
      .setTitle(`${title}`)
      .setColor(0x36393e)
      .setDescription(
        `${description.slice(0, 2045)}${description.length > 2048 ? "..." : ""}`
      );
    return message.reply({ embeds: [emb], components: [row] });
  }
};
